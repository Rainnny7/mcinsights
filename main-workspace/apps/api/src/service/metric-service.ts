import { Point } from "@influxdata/influxdb-client";
import chalk from "chalk";
import { and, eq } from "drizzle-orm";
import { StatusMap } from "elysia";
import { db } from "../db";
import { server as serverSchema } from "../db/schema/server";
import { GenericError } from "../error/generic-error";
import { auth } from "../lib/auth";
import type { Context } from "../lib/context";
import { env } from "../lib/env";
import { executeWithBuilder, writeApi } from "../lib/influx";
import { QueryBuilder } from "../lib/influx/query-builder";
import Logger from "../lib/logger";
import { parseToMillis, TimeUnit } from "../lib/time";
import type { QueryServerMetricsBody } from "../types/body/ingest-metrics-body";
import type { InfluxQueryResult, InfluxQueryResultRow } from "../types/influx";
import {
    METRIC_TYPES,
    type IngestableMetric,
    type PointMetric,
} from "../types/metric";
import type { MinecraftServer } from "../types/server";

export default class MetricService {
    private static WRITE_INTERVAL: number = TimeUnit.toMillis(
        TimeUnit.Second,
        30
    );

    private static instance: MetricService;

    /**
     * The points that have been queued to be written to the database.
     * <p>
     * Rather than writing to the database immediately, queue the points
     * to be saved by a background worker, and when the application exits.
     * </p>
     */
    private static queuedPoints: Set<Point> = new Set();

    constructor() {
        if (MetricService.instance) {
            return MetricService.instance;
        }
        MetricService.instance = this;
        setInterval(this.writeQueued, MetricService.WRITE_INTERVAL);
    }

    /**
     * Handle ingesting metrics into the service.
     *
     * @param serverId the id of the server to ingest metrics for
     * @param metrics the metrics to ingest
     */
    static ingestMetrics = async (
        serverId: string,
        metrics: IngestableMetric[]
    ) => {
        // Validate the query before trying to ingest
        this.validateIngestQuery(metrics);

        // Get the server and ensure it exists
        const server: MinecraftServer | undefined = (
            await db
                .select()
                .from(serverSchema)
                .where(eq(serverSchema.id, serverId))
        )?.[0];
        if (!server) {
            throw new GenericError(
                "Server not found",
                StatusMap["Bad Request"]
            );
        }

        // Queue the metrics
        let points: number = 0;
        let events: number = 0;
        for (const metric of metrics) {
            if (metric.type === "point") {
                points++;
                this.queuePoint(server, metric as PointMetric);
            } else if (metric.type === "event") {
                events++;
                // TODO: Queue event
            }
        }
        Logger.debug(
            `[INFLUX QUEUE] Queued ${points} point(s) and ${events} event(s) for server ${serverId}.`
        );
    };

    /**
     * Query metrics for an organization.
     *
     * @param ctx the context
     * @param input the input
     */
    static queryMetrics = async (
        ctx: Context,
        input: QueryServerMetricsBody
    ) => {
        const { organizationId, serverId, metric, timeRangeMin, timeRangeMax } =
            input;

        await auth.api.getOrganization({
            params: {
                organizationId,
            },
        });

        // Get the server and ensure it exists
        const server: MinecraftServer | undefined = (
            await db
                .select()
                .from(serverSchema)
                .where(
                    and(
                        eq(serverSchema.id, serverId),
                        eq(serverSchema.organizationId, organizationId)
                    )
                )
        )?.[0];
        if (!server) {
            throw new GenericError(
                "Server not found",
                StatusMap["Bad Request"]
            );
        }

        // Build the initial query, and then append the operations
        // from the given metric. Afterwards, execute the query
        // and return the result.
        try {
            const before: number = Date.now();
            const query = new QueryBuilder();
            const isSameRange: boolean = timeRangeMin === timeRangeMax;
            let timeRangeMs: number | undefined;

            // Only use a range between two dates if both min
            // and max is present, and the dates aren't the same.
            if (!timeRangeMax || isSameRange) {
                // Parse time range like "1d", "30d", etc.
                timeRangeMs = timeRangeMin
                    ? parseToMillis(timeRangeMin)
                    : TimeUnit.toMillis(TimeUnit.Day, 1); // default to 1d
                query.range(`-${timeRangeMin || "1d"}`);
            } else {
                query.rangeWithMinMax(timeRangeMin, timeRangeMax);
            }

            query
                .filterByTag("environment", env.NODE_ENV)
                .filterByTag("server", serverId)
                .filterByField("measurement", metric)
                .aggregateWindow(
                    timeRangeMs &&
                        timeRangeMs <= TimeUnit.toMillis(TimeUnit.Day, 1)
                        ? "1h"
                        : "1d",
                    "last",
                    false
                );

            // Execute the query and get the result
            const result: InfluxQueryResult<any> =
                await executeWithBuilder<any>(query);

            // Transform the data to the appropriate format
            const transformed = result.data
                .sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                )
                .reduce(
                    (acc: Record<string, any>, row: InfluxQueryResultRow) => {
                        const timestamp: string = row.timestamp;
                        if (!acc[timestamp]) {
                            acc[timestamp] = {};
                        }
                        acc[timestamp][row.field] = row.value;
                        return acc;
                    },
                    {} as Record<string, any>
                );

            // Return the result
            return {
                metrics: transformed,
                latestDataPoint: result.data[result.data.length - 1].timestamp,
                time: Date.now() - before,
            };
        } catch (error) {
            Logger.error(
                chalk.red(
                    `Failed to fetch metric ${metric} for server ${serverId}:`
                ),
                error
            );
            throw new GenericError(
                "Error executing query",
                StatusMap["Internal Server Error"]
            );
        }
    };

    /**
     * Validate the query for ingesting metrics.
     *
     * @param metrics the metrics to ingest
     * @throws GenericError if the query is invalid
     */
    private static validateIngestQuery = (metrics: IngestableMetric[]) => {
        // Check that there are metrics to ingest
        if (!metrics.length) {
            throw new GenericError(
                "No metrics to ingest",
                StatusMap["Bad Request"]
            );
        }

        // Validate that each metric is valid
        for (const metric of metrics) {
            if (!METRIC_TYPES.includes(metric.type)) {
                throw new GenericError(
                    "Invalid metric type",
                    StatusMap["Bad Request"]
                );
            }
        }
    };

    /**
     * Queue a point metric for writing to the database.
     *
     * @param serverId the id of the server to queue the point for
     * @param metric the point metric to queue
     */
    private static queuePoint = (
        server: MinecraftServer,
        metric: PointMetric
    ) => {
        const point: Point = new Point(metric.id)
            .tag("organization", server.organizationId)
            .tag("server", server.id)
            .intField("value", metric.value);
        if (metric.tags) {
            for (const tag of Object.keys(metric.tags)) {
                point.tag(tag, metric.tags[tag]);
            }
        }
        MetricService.queuedPoints.add(point);
    };

    /**
     * Write the queued metrics to the database.
     */
    private writeQueued = async () => {
        // Nothing queued to write
        if (!MetricService.queuedPoints.size) {
            return;
        }
        const points: Point[] = Array.from(MetricService.queuedPoints);
        const before: number = Date.now();

        // Write the points
        Logger.debug(
            `[INFLUX QUEUE] Writing ${points.length} point(s) to Influx...`
        );
        writeApi.writePoints(points);
        await writeApi.flush();

        Logger.debug(
            `[INFLUX QUEUE] Took ${Date.now() - before}ms to write ${
                points.length
            } point(s) to Influx.`
        );

        MetricService.queuedPoints = new Set();
    };
}
