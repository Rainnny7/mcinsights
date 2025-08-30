import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import OrganizationAvatar from "../../../../components/dashboard/organization-avatar";
import DashboardPageHeader from "../../../../components/dashboard/page-header";
import { getFullOrganization } from "../../../../lib/organization";

const OrganizationPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement> => {
    const { slug } = await params;
    const organization: Organization = (await getFullOrganization(slug))!;

    return (
        <DashboardPageHeader
            icon={<OrganizationAvatar organization={organization} />}
            title={organization.name}
            description="Here's an overview of your organization"
            withIconClasses={false}
        >
            {organization.name} overview page
        </DashboardPageHeader>
    );
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const organization: Organization | undefined = await getFullOrganization(
        slug
    );
    if (!organization) notFound();

    return {
        title: organization.name,
    };
};

export default OrganizationPage;
