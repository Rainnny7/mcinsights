import { UserIcon } from "lucide-react";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import DashboardPageHeader from "../../../../components/dashboard/page-header";

export const metadata: Metadata = {
    title: "Account",
    description: "Manage your account settings",
};

const AccountPage = (): ReactElement => (
    <DashboardPageHeader
        icon={<UserIcon />}
        title="My Account"
        description="Manage your account settings"
    >
        <span className="text-destructive">
            Account settings coming soon...
        </span>
    </DashboardPageHeader>
);
export default AccountPage;
