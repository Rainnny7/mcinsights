import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

export const metadata: Metadata = {
    title: "Auth",
    description: "Login to your account",
};

const AuthLayout = async ({
    children,
}: {
    children: ReactNode;
}): Promise<ReactElement> => {
    const session = await getSession();
    if (session) {
        redirect("/dashboard");
    }
    return <>{children}</>;
};

export default AuthLayout;
