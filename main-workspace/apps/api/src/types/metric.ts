export type MetricType = "point" | "event";

export const METRIC_TYPES: MetricType[] = ["point", "event"];

export type IngestableMetric = {
    id: string;
    type: MetricType;
    timestamp: Date;
};

export type PointMetric = IngestableMetric & {
    type: "point";
    value: number;
    tags?: Record<string, string>;
};

export type EventMetric = IngestableMetric & {
    type: "event";
    data: Record<string, unknown>;
};
