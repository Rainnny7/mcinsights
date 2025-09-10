import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import FadeInAnimation from "../../../../components/animation/fade-in-animation";
import OrganizationAvatar from "../../../../components/dashboard/organization-avatar";
import SetupRecommendations from "../../../../components/dashboard/overview/setup-recommendations";
import StatCards from "../../../../components/dashboard/overview/stat-cards";
import DashboardPageHeader from "../../../../components/dashboard/page-header";
import { getFullOrganization } from "../../../../lib/organization";

const OrganizationPage = async ({
    params,
}: PageProps<"/dashboard/[slug]">): Promise<ReactElement> => {
    const { slug } = await params;
    const organization: Organization = (await getFullOrganization(slug))!;

    return (
        <DashboardPageHeader
            className="gap-4"
            icon={<OrganizationAvatar organization={organization} />}
            title={organization.name}
            description="Here's an overview of your organization"
            withIconClasses={false}
        >
            <SetupRecommendations />
            <FadeInAnimation delay={0.8}>
                <StatCards />
            </FadeInAnimation>
        </DashboardPageHeader>
    );
};

export const generateMetadata = async ({
    params,
}: PageProps<"/dashboard/[slug]">): Promise<Metadata> => {
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
