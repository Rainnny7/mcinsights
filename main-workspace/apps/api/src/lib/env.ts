import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        // App
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        PORT: z.number(),

        // Drizzle
        DRIZZLE_DATABASE_URL: z.string(),

        // CORS
        CORS_ORIGIN: z.string(),

        // BetterAuth
        BETTER_AUTH_URL: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        DISCORD_CLIENT_ID: z.string(),
        DISCORD_CLIENT_SECRET: z.string(),
    },

    client: {},

    runtimeEnv: {
        // App
        NODE_ENV: process.env.NODE_ENV,
        PORT: parseInt(process.env.PORT ?? "3000"),

        // Drizzle
        DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,

        // CORS
        CORS_ORIGIN: process.env.CORS_ORIGIN,

        // BetterAuth
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    },

    /**
     * This is the prefix for the environment variables that are available on the client.
     */
    clientPrefix: "NEXT_PUBLIC_",

    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,

    /**
     * Whether to check if the environment variables are valid.
     */
    isServer: true,
});

export const isProd = env.NODE_ENV === "production";
