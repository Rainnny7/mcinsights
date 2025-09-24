import { auth } from "@/lib/auth";
import { createContext } from "@/lib/context";
import { appRouter } from "@/routers";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import "dotenv/config";
import { Elysia, ValidationError } from "elysia";
import { decorators } from "elysia-decorators";
import { BunAdapter } from "elysia/adapter/bun";
import MetricsController from "./controller/metrics-controller";
import { env } from "./lib/env";
import MetricService from "./service/metric-service";

new Elysia({
    adapter: BunAdapter,
    prefix: "/v1",
    normalize: true,
})
    .use(
        cors({
            origin: env.CORS_ORIGIN,
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        })
    )
    .all("/api/auth/*", async (context) => {
        const { request } = context;
        if (["POST", "GET"].includes(request.method)) {
            return auth.handler(request);
        }
        return new Response("Method Not Allowed", { status: 405 });
    })
    .all("/trpc/*", async (context) => {
        const { request } = context;
        return fetchRequestHandler({
            endpoint: "/trpc",
            router: appRouter,
            req: request,
            createContext: () => createContext({ context }),
        });
    })
    .use(
        decorators({
            controllers: [MetricsController],
        })
    )
    // Handle application errors
    .onError({ as: "global" }, ({ code, error }) => {
        // Handle validation errors
        if (code === "VALIDATION") {
            return (error as ValidationError).all;
        }

        // Map error codes to status codes
        const statusCodeMap: Record<string, number> = {
            INTERNAL_SERVER_ERROR: 500,
            NOT_FOUND: 404,
            PARSE: 400,
            INVALID_COOKIE_SIGNATURE: 401,
        };

        const status: number =
            "status" in error ? error.status : statusCodeMap[code] || 500;
        const errorCode: string =
            code === "UNKNOWN" ? "INTERNAL_SERVER_ERROR" : code;

        return {
            statusCode: status,
            ...(error instanceof Error &&
                error.message !== errorCode && { message: error.message }),
            timestamp: new Date().toISOString(),
        };
    })
    .listen(env.PORT, () => {
        new MetricService();
        console.log(`Server is running on http://localhost:${env.PORT}`);
    });
