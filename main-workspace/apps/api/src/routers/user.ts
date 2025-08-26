import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";

export const userRouter = router({
    completeOnboarding: protectedProcedure
        .input(
            z.object({
                orgName: z.string(),
                orgSlug: z.string(),
                serverName: z.string().optional(),
                serverPlatform: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { orgName, orgSlug, serverName, serverPlatform } = input;
            console.log(input);


            
            return {
                message: "Onboarding completed",
                user: ctx.session.user,
            };
        }),
});
