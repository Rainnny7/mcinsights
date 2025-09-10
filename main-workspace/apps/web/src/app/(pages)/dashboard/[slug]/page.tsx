import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { UsersIcon } from "../../../../components/animate-ui/icons/users";
import FadeInAnimation from "../../../../components/animation/fade-in-animation";
import GenericChart from "../../../../components/dashboard/metric/generic-chart";
import OrganizationAvatar from "../../../../components/dashboard/organization-avatar";
import SetupRecommendations from "../../../../components/dashboard/overview/setup-recommendations";
import StatCards from "../../../../components/dashboard/overview/stat-cards";
import DashboardPageHeader from "../../../../components/dashboard/page-header";
import { getFullOrganization } from "../../../../lib/organization";

const chartData = [
    { date: "2024-04-01", online: 222 },
    { date: "2024-04-02", online: 97 },
    { date: "2024-04-03", online: 167 },
    { date: "2024-04-04", online: 242 },
    { date: "2024-04-05", online: 373 },
    { date: "2024-04-06", online: 301 },
    { date: "2024-04-07", online: 245 },
    { date: "2024-04-08", online: 409 },
    { date: "2024-04-09", online: 59 },
    { date: "2024-04-10", online: 261 },
    { date: "2024-04-11", online: 327 },
    { date: "2024-04-12", online: 292 },
    { date: "2024-04-13", online: 342 },
    { date: "2024-04-14", online: 137 },
    { date: "2024-04-15", online: 120 },
    { date: "2024-04-16", online: 138 },
    { date: "2024-04-17", online: 446 },
    { date: "2024-04-18", online: 364 },
    { date: "2024-04-19", online: 243 },
    { date: "2024-04-20", online: 89 },
    { date: "2024-04-21", online: 137 },
    { date: "2024-04-22", online: 224 },
    { date: "2024-04-23", online: 138 },
    { date: "2024-04-24", online: 387 },
    { date: "2024-04-25", online: 215 },
    { date: "2024-04-26", online: 75 },
    { date: "2024-04-27", online: 383 },
    { date: "2024-04-28", online: 122 },
    { date: "2024-04-29", online: 315 },
    { date: "2024-04-30", online: 454 },
    { date: "2024-05-01", online: 165 },
    { date: "2024-05-02", online: 293 },
    { date: "2024-05-03", online: 247 },
    { date: "2024-05-04", online: 385 },
    { date: "2024-05-05", online: 481 },
    { date: "2024-05-06", online: 498 },
    { date: "2024-05-07", online: 388 },
    { date: "2024-05-08", online: 149 },
    { date: "2024-05-09", online: 227 },
    { date: "2024-05-10", online: 293 },
    { date: "2024-05-11", online: 335 },
    { date: "2024-05-12", online: 197 },
    { date: "2024-05-13", online: 197 },
    { date: "2024-05-14", online: 448 },
    { date: "2024-05-15", online: 473 },
    { date: "2024-05-16", online: 338 },
    { date: "2024-05-17", online: 499 },
    { date: "2024-05-18", online: 315 },
    { date: "2024-05-19", online: 235 },
    { date: "2024-05-20", online: 177 },
    { date: "2024-05-21", online: 82 },
    { date: "2024-05-22", online: 81 },
    { date: "2024-05-23", online: 252 },
    { date: "2024-05-24", online: 294 },
    { date: "2024-05-25", online: 201 },
    { date: "2024-05-26", online: 213 },
    { date: "2024-05-27", online: 420 },
    { date: "2024-05-28", online: 233 },
    { date: "2024-05-29", online: 78 },
    { date: "2024-05-30", online: 340 },
    { date: "2024-05-31", online: 178 },
    { date: "2024-06-01", online: 178 },
    { date: "2024-06-02", online: 470 },
    { date: "2024-06-03", online: 103 },
    { date: "2024-06-04", online: 439 },
    { date: "2024-06-05", online: 88 },
    { date: "2024-06-06", online: 294 },
    { date: "2024-06-07", online: 323 },
    { date: "2024-06-08", online: 385 },
    { date: "2024-06-09", online: 438 },
    { date: "2024-06-10", online: 155 },
    { date: "2024-06-11", online: 92 },
    { date: "2024-06-12", online: 492 },
    { date: "2024-06-13", online: 81 },
    { date: "2024-06-14", online: 426 },
    { date: "2024-06-15", online: 307 },
    { date: "2024-06-16", online: 371 },
    { date: "2024-06-17", online: 475 },
    { date: "2024-06-18", online: 107 },
    { date: "2024-06-19", online: 341 },
    { date: "2024-06-20", online: 408 },
    { date: "2024-06-21", online: 169 },
    { date: "2024-06-22", online: 317 },
    { date: "2024-06-23", online: 480 },
    { date: "2024-06-24", online: 132 },
    { date: "2024-06-25", online: 141 },
    { date: "2024-06-26", online: 434 },
    { date: "2024-06-27", online: 448 },
    { date: "2024-06-28", online: 149 },
    { date: "2024-06-29", online: 103 },
    { date: "2024-06-30", online: 446 },
];

const OrganizationPage = async ({
    params,
}: PageProps<"/dashboard/[slug]">): Promise<ReactElement> => {
    const { slug } = await params;
    const organization: Organization | undefined = await getFullOrganization(
        slug
    );
    if (!organization) notFound();

    return (
        <DashboardPageHeader
            icon={<OrganizationAvatar organization={organization} />}
            title={organization.name}
            description="Here's an overview of your organization"
            withIconClasses={false}
        >
            <SetupRecommendations />
            <FadeInAnimation delay={0.8}>
                <StatCards />
            </FadeInAnimation>
            <FadeInAnimation delay={1.2}>
                <GenericChart
                    icon={<UsersIcon />}
                    title="Players"
                    description="Players over time"
                    fields={[
                        {
                            label: "Online",
                            color: "var(--chart-1)",
                            value: "online",
                        },
                    ]}
                    isLoading={false}
                    data={chartData}
                    responseTime={7}
                />
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
