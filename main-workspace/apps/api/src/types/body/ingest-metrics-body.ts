import { t } from "elysia";

export const ingestMetricsBody = {
    config: {},
    params: t.Object({
        id: t.String({
            required: true,
        }),
    }),
    body: t.Object({
        metrics: t.Array(
            t.Object({
                id: t.String({
                    required: true,
                    pattern: "^[a-z_]+$",
                }),
                value: t.Number({
                    required: true,
                }),
                timestamp: t.String({
                    required: true,
                    pattern:
                        "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?(Z|[+-]\\d{2}:\\d{2})$",
                }),
            })
        ),
    }),
};
