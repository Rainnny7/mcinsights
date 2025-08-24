import { router } from "../lib/trpc";
import { authRouter } from "./auth";
import { dataRouter } from "./data";

export const appRouter = router({
    auth: authRouter,
    data: dataRouter,
});

export type AppRouter = typeof appRouter;
