import {
    InfluxDB,
    type QueryApi,
    type WriteApi,
} from "@influxdata/influxdb-client";
import type {
    InfluxQueryResult,
    InfluxQueryResultRow,
} from "../../types/influx";
import { env } from "../env";
import { QueryBuilder } from "./query-builder";

export const influxClient: InfluxDB = new InfluxDB({
    url: env.INFLUXDB_URL!,
    token: env.INFLUXDB_TOKEN!,
});

export const writeApi: WriteApi = influxClient.getWriteApi(
    env.INFLUXDB_ORG!,
    env.INFLUXDB_BUCKET!
);

export const queryApi: QueryApi = influxClient.getQueryApi(env.INFLUXDB_ORG!);

/**
 * Execute a query with a query builder.
 *
 * @param queryBuilder the query builder to use
 * @returns the result of the query
 */
export const executeWithBuilder = async <T>(
    queryBuilder: QueryBuilder
): Promise<InfluxQueryResult<T>> => {
    return await executeQuery(queryBuilder.build(), queryBuilder.queryGroupBy);
};

/**
 * Execute a read query.
 *
 * @param query the query to execute
 * @param groupBy the column to group by - used internally
 * @returns the result of the query
 */
export const executeQuery = async <T>(
    query: string,
    groupBy?: string
): Promise<InfluxQueryResult<T>> => {
    // Execute the query and collect the results
    const result: Array<T> = await queryApi.collectRows<T>(query);

    // Map the results to the appropriate format
    const rows: InfluxQueryResultRow[] = result.map((row: any) => {
        const tags: Record<string, string> = {};
        const fields: Record<string, unknown> = {};

        // Get the tags and fields from the row
        Object.keys(row).forEach((key: string) => {
            if (!key.startsWith("_")) {
                tags[key] = row[key] as string;
            } else {
                fields[key] = row[key];
            }
        });

        return {
            tags,
            fields,
            field: fields["_field"] as string,
            groupBy: groupBy ? (row[groupBy] as string) : undefined,
            value: fields["_value"],
            raw: row,
            timestamp: fields["_time"] as string,
        };
    });

    // Return the result
    return {
        query,
        data: rows,
        raw: result,
    };
};
