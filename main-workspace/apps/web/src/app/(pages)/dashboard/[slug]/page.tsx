import { Building2Icon } from "lucide-react";
import type { ReactElement } from "react";
import DashboardPageHeader from "../../../../components/dashboard/page-header";

const OrganizationPage = (): ReactElement => (
    <DashboardPageHeader
        icon={Building2Icon}
        title="Organization"
        description="Manage your organization"
    >
        org overview page
    </DashboardPageHeader>
);
export default OrganizationPage;
