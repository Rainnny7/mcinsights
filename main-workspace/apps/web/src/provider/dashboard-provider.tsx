"use client";

import type { Organization } from "better-auth/plugins/organization";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import DashboardLoadingOverlay from "../components/dashboard/loading-overlay";
import { authClient } from "../lib/auth-client";
import type { User } from "../types/auth";

type DashboardContextType = {
    /**
     * Whether the dashboard is loading.
     */
    loading: boolean;

    /**
     * The authenticated user.
     */
    user: User;

    /**
     * The organizations the user is a member of.
     */
    organizations: Organization[];

    /**
     * The currently active organization.
     */
    activeOrganization: Organization | undefined;

    /**
     * The minimum time range for the chart.
     */
    timeRangeMin: string;

    /**
     * The maximum time range for the chart.
     */
    timeRangeMax: string | undefined;

    /**
     * Updates the currently active organization.
     */
    updateActiveOrganization: (organization: Organization | undefined) => void;

    /**
     * Updates the time range for the chart.
     */
    updateTimeRange: (
        timeRangeMin: string,
        timeRangeMax: string | undefined
    ) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

type DashboardProviderProps = {
    user: User;
    children: ReactNode;
};

export const DashboardProvider = ({
    user,
    children,
}: DashboardProviderProps) => {
    const path: string = usePathname();
    const [activeOrganization, setActiveOrganization] = useState<
        Organization | undefined
    >(undefined);
    const [timeRangeMin, setTimeRangeMin] = useState<string>("30d");
    const [timeRangeMax, setTimeRangeMax] = useState<string | undefined>(
        undefined
    );

    // Get the user's organizations
    const { isPending: isLoadingOrganizations, data: organizations } =
        authClient.useListOrganizations();

    // Whether the dashboard is loading
    const isLoading: boolean = isLoadingOrganizations;

    // Scroll to the top of the page when the path changes
    useEffect(() => window.scrollTo(0, 0), [path]);

    // Set the active organization based on the path
    useEffect(() => {
        const currentPathSlug: string = path.split("/")[2] ?? "";
        const organization: Organization | undefined = organizations?.find(
            (organization: Organization) =>
                organization.slug === currentPathSlug
        );
        setActiveOrganization(organization);
    }, [path, organizations]);

    return (
        <DashboardContext.Provider
            value={{
                loading: isLoading,
                user,
                organizations: organizations ?? [],
                activeOrganization,
                updateActiveOrganization: (
                    organization: Organization | undefined
                ) => {
                    setActiveOrganization(organization);
                },
                timeRangeMin,
                timeRangeMax,
                updateTimeRange: (
                    timeRangeMin: string,
                    timeRangeMax: string | undefined
                ) => {
                    setTimeRangeMin(timeRangeMin);
                    setTimeRangeMax(timeRangeMax);
                },
            }}
        >
            {children}
            <AnimatePresence mode="wait">
                {isLoading && <DashboardLoadingOverlay key="loading" />}
            </AnimatePresence>
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
};
