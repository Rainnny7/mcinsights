import { Point } from "@influxdata/influxdb-client";
import { eq } from "drizzle-orm";
import { StatusMap } from "elysia";
import { db } from "../db";
import { server as serverSchema } from "../db/schema/server";
import { GenericError } from "../error/generic-error";
import { writeApi } from "../lib/influx";
import Logger from "../lib/logger";
import { TimeUnit } from "../lib/time";
import { type IngestableMetric } from "../types/metric";
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
        // Check that there are metrics to ingest
        if (!metrics.length) {
            throw new GenericError(
                "No metrics to ingest",
                StatusMap["Bad Request"]
            );
        }

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
        for (const metric of metrics) {
            const point: Point = new Point(metric.id)
                .tag("server", serverId)
                .intField("value", metric.value);
            if (metric.tags) {
                for (const tag of Object.keys(metric.tags)) {
                    point.tag(tag, metric.tags[tag]);
                }
            }
            MetricService.queuedPoints.add(point);
        }
        Logger.debug(
            `[INFLUX QUEUE] Queued ${metrics.length} point(s) for server ${serverId}.`
        );
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
