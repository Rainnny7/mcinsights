import { protectedProcedure, router } from "../lib/trpc";
import MetricService from "../service/metric-service";
import { queryMetricsBody } from "../types/body/ingest-metrics-body";

export const metricsRouter = router({
    /**
     * Handle completing the onboarding process for a user.
     */
    queryMetrics: protectedProcedure
        .input(queryMetricsBody)
        .query(async ({ ctx, input }) =>
            await MetricService.queryMetrics(ctx, input)
        ),
});
