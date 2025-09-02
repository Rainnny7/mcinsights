import { betterAuth, type Account } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { encrypt } from "./crypto";
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
    databaseHooks: {
        // When signing up or signing in with OAuth, ensure the user's access
        // and refresh tokens are encrypted when stored in the database.
        account: {
            create: {
                before: async (account: Account) => encryptAccountData(account),
            },
            update: {
                before: async (account: Partial<Account>) => encryptAccountData(account),
            },
        },
    },
    telemetry: {
        enabled: false,
    },
});

/**
 * Ensure the access and refresh tokens
 * are encrypted for the given account.
 *
 * @param account the account to encrypt
 * @returns the account with the access and refresh tokens encrypted
 */
const encryptAccountData = (account: any) => {
    return {
        data: {
            ...account,
            accessToken: encrypt(account.accessToken as string),
            refreshToken: encrypt(account.refreshToken as string),
        },
    };
};
