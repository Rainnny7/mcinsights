import AppLogo from "@/components/app-logo";
import LoginForm from "@/components/auth/login-card";
import Background from "@/components/background";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import ScaleInAnimation from "../../components/animation/scale-in-animation";
import BasicFooter from "../../components/basic-footer";
import { getSession } from "../../lib/auth";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

const LoginPage = async (): Promise<ReactElement> => {
    const session = await getSession();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Background />
            <ScaleInAnimation
                className="relative min-w-60 flex flex-col gap-5 justify-center items-center z-10"
                delay={0.6}
            >
                <AppLogo size={116} />
                <LoginForm />
            </ScaleInAnimation>
            <BasicFooter />
        </div>
    );
};
export default LoginPage;
