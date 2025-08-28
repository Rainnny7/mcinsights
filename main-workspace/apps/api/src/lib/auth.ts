import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { env } from "./env";

export const auth: any = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    user: {
        additionalFields: {
            selectedOrganizationId: {
                type: "string",
                required: false,
                defaultValue: null,
                input: false,
            },
            onboarded: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },
    },
    trustedOrigins: [env.CORS_ORIGIN],
    socialProviders: {
        discord: {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
            prompt: "consent",
        },
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
    },
    plugins: [organization()],
    hooks: {
        // When a user logs in, redirect them to their active organization, if any
        after: createAuthMiddleware(async (ctx) => {
            // Only redirect on successful login
            if (!ctx.path.startsWith("/callback/")) {
                return;
            }
            const { user } = ctx.context.newSession!;
            let organizationId = user.selectedOrganizationId;

            // No active organization, use the first one the user has access to
            if (!organizationId) {
                organizationId = (
                    await db
                        .select()
                        .from(schema.member)
                        .where(eq(schema.member.userId, user.id))
                        .limit(1)
                )?.[0]?.organizationId;
            }

            // No active organization to redirect to
            if (!organizationId) return;

            const organization = (await db
                .select()
                .from(schema.organization)
                .where(eq(schema.organization.id, organizationId))
            )?.[0];
            if (!organization) return;

            throw ctx.redirect(
                `${env.CORS_ORIGIN}/dashboard/${organization.slug}`
            );
        }),
    },
    telemetry: {
        enabled: false,
    },
});
