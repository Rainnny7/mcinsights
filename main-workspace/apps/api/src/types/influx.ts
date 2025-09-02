/**
 * The result of a query to Influx.
 */
export type InfluxQueryResult<T> = {
    /**
     * The query that was executed.
     */
    query: string;

    /**
     * The data of the result.
     */
    data: InfluxQueryResultRow[];

    /**
     * The raw result of the query.
     */
    raw: T[];
};

/**
 * A row of the result of a query to Influx.
 */
export type InfluxQueryResultRow = {
    /**
     * The tags of the row.
     */
    tags: Record<string, string>;

    /**
     * The fields of the row.
     */
    fields: Record<string, unknown>;

    /**
     * The field of the row.
     */
    field: string;

    /**
     * The value of the group by of the row.
     */
    groupBy: string | undefined;

    /**
     * The value of the row.
     */
    value: unknown;

    /**
     * The raw value of the row.
     */
    raw: unknown;

    /**
     * The timestamp of the row.
     */
    timestamp: string;
};
