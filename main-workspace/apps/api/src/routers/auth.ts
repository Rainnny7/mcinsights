import { protectedProcedure, router } from "../lib/trpc";

export const authRouter = router({
    me: protectedProcedure.query(({ ctx }) => {
        return {
            user: ctx.session.user,
        };
    }),
});
