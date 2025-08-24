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
    const { data } = await getSession();
    if (!data) {
        redirect("/");
    }
    return (
        <main>
            <DashboardNavbar />
            {children}
        </main>
    );
};
export default DashboardLayout;
