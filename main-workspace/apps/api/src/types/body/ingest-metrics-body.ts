import { t } from "elysia";
import { z } from "zod";

export const ingestMetricsBody = {
    config: {},
    params: t.Object({
        id: t.String({
            required: true,
            pattern:
                "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        }),
    }),
    body: t.Object({
        metrics: t.Array(
            t.Object({
                id: t.String({
                    required: true,
                    pattern: "^[a-z_]+$",
                }),
                type: t.String({
                    required: true,
                    pattern: "^(point|event)$",
                }),
                value: t.Number({
                    required: true,
                }),
                timestamp: t.String({
                    required: true,
                    pattern:
                        "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?(Z|[+-]\\d{2}:?\\d{2})$",
                }),
            })
        ),
    }),
};

export type QueryMetricsBody = z.infer<typeof queryMetricsBody>;

export const queryMetricsBody = z.object({
    organizationId: z.string(),

    /**
     * The id of the server to query metrics for, undefined if querying all servers.
     */
    serverId: z
        .string()
        .regex(
            new RegExp(
                "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
            )
        )
        .optional(),
    metric: z.string(),
    timeRangeMin: z.string(),
    timeRangeMax: z.string().optional(),
});
