"use client";

import { HomeIcon } from "lucide-react";
import { type ReactElement } from "react";
import OrganizationList from "../../../components/dashboard/overview/organization-list";
import DashboardPageHeader from "../../../components/dashboard/page-header";
import { useDashboard } from "../../../provider/dashboard-provider";

const DashboardPage = (): ReactElement => {
    const { user } = useDashboard();
    return (
        <DashboardPageHeader
            icon={HomeIcon}
            title="Dashboard"
            description={`Welcome, ${user.name}! Select an organization to get started.`}
        >
            <OrganizationList />
        </DashboardPageHeader>
    );
};
export default DashboardPage;
