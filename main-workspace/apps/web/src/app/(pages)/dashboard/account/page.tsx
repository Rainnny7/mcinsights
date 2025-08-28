import { UserIcon } from "lucide-react";
import type { ReactElement } from "react";
import DashboardPageHeader from "../../../../components/dashboard/page-header";

const AccountPage = (): ReactElement => (
    <DashboardPageHeader
        icon={UserIcon}
        title="My Account"
        description="Manage your account settings"
    >
        <span>My account settings...</span>
    </DashboardPageHeader>
);
export default AccountPage;
