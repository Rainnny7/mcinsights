import { env } from "@/lib/env";
import {
    QueryCache,
    QueryClient,
    type DefaultError,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { toast } from "sonner";
import type { AppRouter } from "../../../api/src/routers";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: DefaultError) => {
            toast.error(error.message, {
                action: {
                    label: "retry",
                    onClick: () => {
                        queryClient.invalidateQueries();
                    },
                },
            });
        },
    }),
});

export const trpcClient = createTRPCClient<AppRouter>({
    links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
            enabled: (opts) =>
                env.NODE_ENV === "development" ||
                (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
            url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
        }),
    ],
});

export const trpc = createTRPCReact<AppRouter>();
