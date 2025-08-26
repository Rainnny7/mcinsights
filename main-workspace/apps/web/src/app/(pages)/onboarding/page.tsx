import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import FadeInAnimation from "../../../components/animation/fade-in-animation";
import AppLogo from "../../../components/app-logo";
import Background from "../../../components/background";
import BasicFooter from "../../../components/basic-footer";
import LogoutButton from "../../../components/onboarding/logout-button";
import UserOnboardingSteps from "../../../components/onboarding/user-onboarding-steps";
import { checkAndGetSession } from "../../../lib/auth";

export const metadata: Metadata = {
    title: "Onboarding",
    description: "Onboard to your account",
};

const OnboardingPage = async (): Promise<ReactElement> => {
    const { user } = await checkAndGetSession();
    if (user.onboarded) {
        redirect("/dashboard");
    }
    return (
        <main className="mx-auto max-w-screen-2xl">
            <Background />
            <div className="relative min-h-screen flex flex-col gap-5 justify-center items-center z-10">
                {/* Branding */}
                <FadeInAnimation
                    className="absolute inset-x-0 top-7 flex justify-center gap-3 items-center"
                    direction="top"
                >
                    <AppLogo size={72} />
                    <span className="text-2xl font-minecraft">
                        Minecraft Metrics
                    </span>
                </FadeInAnimation>

                {/* Content */}
                <FadeInAnimation direction="bottom" delay={0.45}>
                    <UserOnboardingSteps user={user} />
                </FadeInAnimation>

                {/* Logout */}
                <FadeInAnimation direction="bottom" delay={0.85}>
                    <LogoutButton />
                </FadeInAnimation>
            </div>
            <BasicFooter />
        </main>
    );
};
export default OnboardingPage;
