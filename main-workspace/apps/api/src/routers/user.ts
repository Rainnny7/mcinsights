import { protectedProcedure, router } from "../lib/trpc";
import { completeOnboarding } from "../service/user-service";
import { completeOnboardingBody } from "../types/body/complete-onboarding-body";

export const userRouter = router({
    completeOnboarding: protectedProcedure
        .input(completeOnboardingBody)
        .mutation(async ({ ctx, input }) => {
            await completeOnboarding(ctx, input);
            return { success: true };
        }),
});
