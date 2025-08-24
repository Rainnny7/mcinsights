import FadeInAnimation from "@/components/animation/fade-in-animation";
import LoginCard from "@/components/auth/login-card";
import Background from "@/components/background";
import SimpleTooltip from "@/components/simple-tooltip";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

const LoginPage = async () => (
    <div className="min-h-screen flex justify-center items-center">
        <Background />
        <div className="relative z-10">
            <FadeInAnimation>
                <LoginCard />
            </FadeInAnimation>
        </div>

        {/* Footer */}
        <FadeInAnimation
            className="fixed inset-x-0 bottom-7 text-center text-xs text-muted-foreground"
            direction="bottom"
            delay={0.7}
        >
            Made with <span className="animate-pulse">💚</span> by{" "}
            <SimpleTooltip content="View my website (:" side="top">
                <Link
                    className="text-primary hover:opacity-75 transition-opacity duration-300 transform-gpu"
                    href="https://rainnny.club"
                    target="_blank"
                    draggable={false}
                >
                    Rainnny
                </Link>
            </SimpleTooltip>
        </FadeInAnimation>
    </div>
);
export default LoginPage;
