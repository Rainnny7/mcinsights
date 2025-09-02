import { Controller, Post } from "elysia-decorators";
import MetricService from "../service/metric-service";
import { ingestMetricsBody } from "../types/body/ingest-metrics-body";
import type { IngestableMetric } from "../types/metric";

@Controller("/metrics/:id")
class MetricsController {
    @Post("/ingest", ingestMetricsBody)
    async ingest({
        params: { id },
        body,
    }: {
        params: { id: string };
        body: { metrics: IngestableMetric[] };
    }): Promise<any> {
        await MetricService.ingestMetrics(id, body.metrics);
        return { success: true };
    }
}
export default MetricsController;
