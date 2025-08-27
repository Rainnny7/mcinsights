import { db } from "@/db";
import { user as userSchema } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { server } from "../db/schema/server";
import { protectedProcedure, router } from "../lib/trpc";
import { SERVER_PLATFORMS, type ServerPlatform } from "../types/server";

export const userRouter = router({
    completeOnboarding: protectedProcedure
        .input(
            z.object({
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
                            val &&
                            SERVER_PLATFORMS.includes(val as ServerPlatform),
                        {
                            message: "Invalid server platform",
                        }
                    )
                    .optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx.session;
            const { orgName, orgSlug, serverName, serverPlatform } = input;

            // Create the organization
            const organization = await auth.api.createOrganization({
                body: {
                    name: orgName,
                    slug: orgSlug,
                    userId: user.id,
                    keepCurrentActiveOrganization: false,
                },
                headers: {
                    cookie: ctx.headers.get("cookie") || "",
                },
            });

            // We have data to create a server whilst onboarding, do so
            if (serverName && serverPlatform) {
                await db.insert(server).values({
                    name: serverName,
                    platform: serverPlatform as ServerPlatform,
                    organizationId: organization.id,
                });
            }

            // Update the user to flag onboarded as completed
            await db
                .update(userSchema)
                .set({
                    onboarded: true,
                })
                .where(eq(userSchema.id, user.id));

            return {
                success: true,
            };
        }),
});
