"use client";

import { HomeIcon } from "lucide-react";
import type { ReactElement } from "react";
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
            <span>dash</span>
            <div className="h-96" />
            <div className="h-96" />
            <div className="h-96" />
            <div className="h-96" />
            <div className="h-96" />
            <div className="h-96" />
        </DashboardPageHeader>
    );
};
export default DashboardPage;
