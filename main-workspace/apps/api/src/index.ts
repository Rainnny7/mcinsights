import { auth } from "@/lib/auth";
import { createContext } from "@/lib/context";
import { appRouter } from "@/routers";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import "dotenv/config";
import { Elysia } from "elysia";
import { env } from "./lib/env";

new Elysia()
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
    .listen(env.PORT, () => {
        console.log(`Server is running on http://localhost:${env.PORT}`);
    });
