import type { Metadata } from "next";
import type { ReactElement } from "react";
import { UserIcon } from "../../../../components/animate-ui/icons/user";
import DashboardPageHeader from "../../../../components/dashboard/page-header";

export const metadata: Metadata = {
    title: "Account",
    description: "Manage your account settings",
};

const AccountPage = (): ReactElement => (
    <DashboardPageHeader
        icon={<UserIcon className="size-6" />}
        title="My Account"
        description="Manage your account settings"
    >
        <span className="text-destructive">
            Account settings coming soon...
        </span>
    </DashboardPageHeader>
);
export default AccountPage;
