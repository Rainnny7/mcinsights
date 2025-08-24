import { protectedProcedure, router } from "../lib/trpc";

export const appRouter = router({
    privateData: protectedProcedure.query(({ ctx }) => {
        return {
            message: "This is private",
            user: ctx.session.user
        };
    }),
});
export type AppRouter = typeof appRouter;
