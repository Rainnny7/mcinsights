export type IngestableMetric = {
    id: string;
    value: number;
    tags?: Record<string, string>;
    timestamp: Date;
};
