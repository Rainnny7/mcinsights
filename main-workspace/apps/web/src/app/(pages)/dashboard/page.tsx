import { checkAndGetSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import type { Metadata } from "next";
import { type ReactElement } from "react";
import OrganizationList from "../../../components/dashboard/overview/organization-list";
import DashboardPageHeader from "../../../components/dashboard/page-header";

export const metadata: Metadata = {
    title: "Dashboard",
};

const DashboardPage = async (): Promise<ReactElement> => {
    const { user } = await checkAndGetSession();
    return (
        <DashboardPageHeader
            icon={<HomeIcon />}
            title="Dashboard"
            description={`Welcome, ${user.name}! Select an organization to get started.`}
        >
            <OrganizationList />
        </DashboardPageHeader>
    );
};
export default DashboardPage;
