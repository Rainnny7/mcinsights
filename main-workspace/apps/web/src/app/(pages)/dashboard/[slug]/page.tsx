import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { UsersIcon } from "../../../../components/animate-ui/icons/users";
import FadeInAnimation from "../../../../components/animation/fade-in-animation";
import GenericAreaChart from "../../../../components/chart/generic-area-chart";
import OrganizationAvatar from "../../../../components/dashboard/organization-avatar";
import StatCards from "../../../../components/dashboard/overview/stat-cards";
import DashboardPageHeader from "../../../../components/dashboard/page-header";
import { getFullOrganization } from "../../../../lib/organization";

// Generate randomized chart data
const generateRandomData = () => {
    const data = [];
    const startDate = new Date("2024-04-01");

    // Base values for each server with some variation
    let testProxyBase = 200;
    let hubBase = 150;
    let prisonBase = 100;

    for (let i = 0; i < 91; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split("T")[0];

        // Add some trending and randomness
        const trendFactor = Math.sin(i * 0.1) * 0.3; // Slow trend
        const randomFactor = (Math.random() - 0.5) * 0.4; // Random variation

        // Update base values with some persistence
        testProxyBase += (Math.random() - 0.5) * 20;
        hubBase += (Math.random() - 0.5) * 15;
        prisonBase += (Math.random() - 0.5) * 10;

        // Clamp values to reasonable ranges
        testProxyBase = Math.max(50, Math.min(500, testProxyBase));
        hubBase = Math.max(30, Math.min(400, hubBase));
        prisonBase = Math.max(20, Math.min(300, prisonBase));

        // Apply weekend effects (lower activity)
        const isWeekend =
            currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const weekendMultiplier = isWeekend ? 0.7 : 1.0;

        // Apply time-based effects (evening peak)
        const hour = currentDate.getHours();
        const timeMultiplier =
            hour >= 18 && hour <= 22 ? 1.3 : hour >= 6 && hour <= 8 ? 0.8 : 1.0;

        const testProxy = Math.round(
            testProxyBase *
                (1 + trendFactor + randomFactor) *
                weekendMultiplier *
                timeMultiplier
        );
        const hub = Math.round(
            hubBase *
                (1 + trendFactor + randomFactor) *
                weekendMultiplier *
                timeMultiplier
        );
        const prison = Math.round(
            prisonBase *
                (1 + trendFactor + randomFactor) *
                weekendMultiplier *
                timeMultiplier
        );

        data.push({
            date: dateStr,
            test_proxy: Math.max(0, testProxy),
            hub: Math.max(0, hub),
            prison: Math.max(0, prison),
        });
    }

    return data;
};

const chartData = generateRandomData();

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
            {/* <NoServerDataAlert /> */}
            {/* <SetupRecommendations /> */}
            <StatCards />
            <FadeInAnimation delay={1}>
                <GenericAreaChart
                    icon={<UsersIcon />}
                    title="Players"
                    description="The number of players on each server"
                    fields={[
                        {
                            label: "Test Proxy",
                            color: "var(--chart-1)",
                            value: "test_proxy",
                        },
                        {
                            label: "Hub",
                            color: "var(--chart-2)",
                            value: "hub",
                        },
                        {
                            label: "Prison",
                            color: "var(--chart-3)",
                            value: "prison",
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
