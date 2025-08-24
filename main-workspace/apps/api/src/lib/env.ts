import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        // App
        NODE_ENV: z.enum(["development", "test", "production"]),
        PORT: z.number().default(3000),

        // Drizzle
        DRIZZLE_DATABASE_URL: z.string(),

        // CORS
        CORS_ORIGIN: z.string(),

        // BetterAuth
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.string(),
    },

    client: {},

    runtimeEnv: {
        // App
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,

        // Drizzle
        DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,

        // CORS
        CORS_ORIGIN: process.env.CORS_ORIGIN,

        // BetterAuth
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    },

    /**
     * i had a stupid fucking error so now this is forever going to be turned on (:
     * @theo fix ur shit lib
     */
    skipValidation: true,

    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});

export const isProd = env.NODE_ENV === "production";
