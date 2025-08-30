import FadeInAnimation from "@/components/animation/fade-in-animation";
import LoginCard from "@/components/auth/login-card";
import Background from "@/components/background";
import type { Metadata } from "next";
import BasicFooter from "../../components/basic-footer";
import { getSession } from "../../lib/auth";
import type { ReactElement } from "react";
import { redirect } from "next/navigation";

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
            <div className="relative z-10">
                <FadeInAnimation>
                    <LoginCard />
                </FadeInAnimation>
            </div>
            <BasicFooter />
        </div>
    );
};
export default LoginPage;
