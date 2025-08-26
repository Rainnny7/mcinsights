import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
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
    telemetry: {
        enabled: false,
    },
});
