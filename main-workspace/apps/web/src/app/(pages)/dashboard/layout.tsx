import DashboardNavbar from "@/components/dashboard/navbar";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage metrics for your Minecraft server",
};

const DashboardLayout = async ({
    children,
}: {
    children: ReactNode;
}): Promise<ReactElement> => {
    // Before rendering the page, ensure the user is authenticated.
    const response = await getSession();
    if (!response?.session) {
        redirect("/");
    }
    return (
        <main className="mx-auto max-w-screen-2xl pt-24">
            <DashboardNavbar />
            {children}
        </main>
    );
};
export default DashboardLayout;
