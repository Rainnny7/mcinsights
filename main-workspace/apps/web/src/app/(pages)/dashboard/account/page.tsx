import { UserIcon } from "lucide-react";
import type { ReactElement } from "react";
import DashboardPageHeader from "../../../../components/dashboard/page-header";

const AccountPage = (): ReactElement => (
    <DashboardPageHeader
        icon={UserIcon}
        title="My Account"
        description="Manage your account settings"
    >
        <span>account</span>
    </DashboardPageHeader>
);
export default AccountPage;
