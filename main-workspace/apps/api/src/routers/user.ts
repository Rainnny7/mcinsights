import { db } from "@/db";
import { user as userSchema } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";

export const userRouter = router({
    completeOnboarding: protectedProcedure
        .input(
            z.object({
                orgName: z.string().regex(new RegExp("^[A-Za-z0-9\\s']+$"), {
                    message:
                        "The organization name must contain only letters, numbers, apostrophes, and spaces.",
                }),
                orgSlug: z.string().regex(new RegExp("^[a-z0-9-]+$"), {
                    message:
                        "Slug must contain only lowercase letters, numbers, and hyphens",
                }),
                serverName: z.string().optional(),
                serverPlatform: z.string().optional(),
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

            // TODO: create the server if data is given for it

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
