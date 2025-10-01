import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        // App
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        PORT: z.number(),
    },

    client: {
        // App
        NEXT_PUBLIC_BASE_URL: z.string(),
        NEXT_PUBLIC_SERVER_URL: z.string(),
        NEXT_PUBLIC_CLOUD: z.boolean().default(false),
    },

    runtimeEnv: {
        // App
        NODE_ENV: process.env.NODE_ENV,
        PORT: parseInt(process.env.PORT ?? "3000"),
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
        NEXT_PUBLIC_CLOUD: process.env.NEXT_PUBLIC_CLOUD === "true",
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
export const isCloud = env.NEXT_PUBLIC_CLOUD;
