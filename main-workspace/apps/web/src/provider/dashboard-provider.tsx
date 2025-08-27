"use client";

import type { User } from "better-auth";
import type { Organization } from "better-auth/plugins/organization";
import { AnimatePresence } from "motion/react";
import { createContext, useContext, type ReactNode } from "react";
import DashboardLoadingOverlay from "../components/dashboard/dashboard-loading-overlay";
import { authClient } from "../lib/auth-client";

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
};

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

type DashboardProviderProps = {
    initialUser: User;
    children: ReactNode;
};

export const DashboardProvider = ({
    initialUser,
    children,
}: DashboardProviderProps) => {
    const value: DashboardContextType = {
        loading: false,
        user: initialUser,
        organizations: [],
    };

    // Get the user's organizations
    const { isPending: isLoadingOrganizations, data: organizations } =
        authClient.useListOrganizations();
    if (organizations?.length === 1) {
        value.organizations = organizations;
    }

    // Ensure the loading state is updated
    value.loading = isLoadingOrganizations;

    return (
        <DashboardContext.Provider value={value}>
            <AnimatePresence mode="wait">
                {value.loading && <DashboardLoadingOverlay key="loading" />}
            </AnimatePresence>
            {!value.loading && children}
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
