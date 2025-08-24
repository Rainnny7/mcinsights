import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import "dotenv/config";
import { Elysia } from "elysia";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { env } from "./lib/env";
import { appRouter } from "./routers/index";

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
        context.status(405);
    })
    .all("/trpc/*", async (context) => {
        const res = await fetchRequestHandler({
            endpoint: "/trpc",
            router: appRouter,
            req: context.request,
            createContext: () => createContext({ context }),
        });
        return res;
    })
    .listen(env.PORT, () => {
        console.log(`Server is running on http://localhost:${env.PORT}`);
    });
