import type { Context as ElysiaContext } from "elysia";
import { auth } from "./auth";

export type CreateContextOptions = {
    context: ElysiaContext;
};

export const createContext = async ({ context }: CreateContextOptions) => {
    const session = await auth.api.getSession({
        headers: context.request.headers,
    });
    return {
        session,
        headers: context.request.headers,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
