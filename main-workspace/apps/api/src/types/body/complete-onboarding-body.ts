import { z } from "zod";
import type { ServerPlatform } from "../server";
import { SERVER_PLATFORMS } from "../server";

export type CompleteOnboardingBody = z.infer<typeof completeOnboardingBody>;

export const completeOnboardingBody = z.object({
    orgName: z.string().regex(new RegExp("^[A-Za-z0-9\\s']+$"), {
        message:
            "The server name must contain only letters, numbers, apostrophes, and spaces.",
    }),
    orgSlug: z.string().regex(new RegExp("^[a-z0-9-]+$"), {
        message:
            "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
    serverName: z
        .string()
        .regex(new RegExp("^[A-Za-z0-9\\s']+$"), {
            message:
                "The server name must contain only letters, numbers, apostrophes, and spaces.",
        })
        .optional(),
    serverPlatform: z
        .string()
        .refine(
            (val: string | undefined) =>
                val && SERVER_PLATFORMS.includes(val as ServerPlatform),
            {
                message: "Invalid server platform",
            }
        )
        .optional(),
});
