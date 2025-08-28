"use client";

import type { Organization } from "better-auth/plugins/organization";
import { AnimatePresence } from "motion/react";
import { createContext, useContext, useState, type ReactNode } from "react";
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
     * Updates the currently active organization.
     */
    updateActiveOrganization: (organization: Organization) => void;
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
    const [activeOrganization, setActiveOrganization] = useState<
        Organization | undefined
    >(undefined);

    // Get the user's organizations
    const { isPending: isLoadingOrganizations, data: organizations } =
        authClient.useListOrganizations();

    // Whether the dashboard is loading
    const isLoading: boolean = isLoadingOrganizations;

    return (
        <DashboardContext.Provider
            value={{
                loading: isLoading,
                user,
                organizations: organizations ?? [],
                activeOrganization,
                updateActiveOrganization: (organization: Organization) => {
                    setActiveOrganization(organization);
                },
            }}
        >
            <AnimatePresence mode="wait">
                {isLoading && <DashboardLoadingOverlay key="loading" />}
            </AnimatePresence>
            {!isLoading && children}
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
