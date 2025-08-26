import DashboardNavbar from "@/components/dashboard/navbar";
import { checkAndGetSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { DashboardProvider } from "../../../provider/dashboard-provider";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage metrics for your Minecraft server",
};

const DashboardLayout = async ({
    children,
}: {
    children: ReactNode;
}): Promise<ReactElement> => {
    const { user } = await checkAndGetSession();
    if (!user.onboarded) {
        redirect("/onboarding");
    }
    return (
        <main className="mx-auto max-w-screen-2xl pt-32">
            <DashboardProvider initialUser={user}>
                <DashboardNavbar user={user} />
                {children}
            </DashboardProvider>
        </main>
    );
};
export default DashboardLayout;
