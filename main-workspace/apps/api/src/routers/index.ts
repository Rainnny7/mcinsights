import { router } from "../lib/trpc";
import { authRouter } from "./auth";
import { metricsRouter } from "./metrics";
import { userRouter } from "./user";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
