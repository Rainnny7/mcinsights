import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { PickaxeIcon } from "../../../../components/animate-ui/icons/pickaxe";
import { UsersIcon } from "../../../../components/animate-ui/icons/users";
import FadeInAnimation from "../../../../components/animation/fade-in-animation";
import StatCard from "../../../../components/dashboard/metric/stat-card";
import OrganizationAvatar from "../../../../components/dashboard/organization-avatar";
import DashboardPageHeader from "../../../../components/dashboard/page-header";
import { getFullOrganization } from "../../../../lib/organization";

const OrganizationPage = async ({
    params,
}: PageProps<"/dashboard/[slug]">): Promise<ReactElement> => {
    const { slug } = await params;
    const organization: Organization = (await getFullOrganization(slug))!;

    return (
        <DashboardPageHeader
            icon={<OrganizationAvatar organization={organization} />}
            title={organization.name}
            description="Here's an overview of your organization"
            withIconClasses={false}
        >
            {/* Stat Cards */}
            <div className="mx-auto flex flex-wrap gap-3 items-center">
                <StatCard
                    title="Online Players"
                    description="The number of players that are currently online"
                    icon={<PickaxeIcon />}
                    value={7}
                />
                {Array.from({ length: 5 }).map((_, index) => (
                    <FadeInAnimation key={index} delay={index * 0.15}>
                        <StatCard
                            title="Unique Players"
                            description="The number of unique players that have played on your server"
                            icon={<UsersIcon />}
                            value={Math.floor(Math.random() * 1000)}
                        />
                    </FadeInAnimation>
                ))}
            </div>
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
