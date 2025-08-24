import { protectedProcedure, router } from "../lib/trpc";

export const dataRouter = router({
    privateData: protectedProcedure.query(({ ctx }) => {
        return {
            message: "This is private",
            user: ctx.session.user,
        };
    }),
});
