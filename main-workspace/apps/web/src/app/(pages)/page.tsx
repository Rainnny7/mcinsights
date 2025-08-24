import LoginCard from "@/components/auth/login-card";
import Background from "@/components/background";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

const LoginPage = () => (
    <div className="min-h-screen flex justify-center items-center">
        <Background />
        <div className="relative z-10">
            <LoginCard />
        </div>
    </div>
);
export default LoginPage;
