import { protectedProcedure, router } from "../lib/trpc";
import MetricService from "../service/metric-service";
import { queryServerMetricsBody } from "../types/body/ingest-metrics-body";

export const metricsRouter = router({
    /**
     * Handle completing the onboarding process for a user.
     */
    queryServerMetrics: protectedProcedure
        .input(queryServerMetricsBody)
        .mutation(
            async ({ ctx, input }) =>
                await MetricService.queryServerMetrics(ctx, input)
        ),
});
