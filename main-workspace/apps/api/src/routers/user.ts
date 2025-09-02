import { protectedProcedure, router } from "../lib/trpc";
import UserService from "../service/user-service";
import { completeOnboardingBody } from "../types/body/complete-onboarding-body";

export const userRouter = router({
    /**
     * Handle completing the onboarding process for a user.
     */
    completeOnboarding: protectedProcedure
        .input(completeOnboardingBody)
        .mutation(async ({ ctx, input }) => {
            await UserService.completeOnboarding(ctx, input);
            return { success: true };
        }),
});
