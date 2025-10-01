import { userExistsBody } from "@/types/body/user-exists-body";
import type { User } from "better-auth/types";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import UserService from "../service/user-service";
import { completeOnboardingBody } from "../types/body/complete-onboarding-body";

export const userRouter = router({
    userExists: publicProcedure
        .input(userExistsBody)
        .query(async ({ input }) => {
            const user: User | undefined = await UserService.checkUserExists(
                input
            );
            return {
                exists: user !== undefined,
                ...(user ? { user: { avatar: user.image } } : {}),
            };
        }),

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
