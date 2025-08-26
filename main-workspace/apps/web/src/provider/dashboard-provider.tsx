"use client";

import type { User } from "better-auth";
import type { Organization } from "better-auth/plugins/organization";
import { createContext, useContext, type ReactNode } from "react";
import { authClient } from "../lib/auth-client";

type DashboardContextType = {
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
        user: initialUser,
        organizations: [],
    };

    // Get the user's organizations
    const { data: organizations } = authClient.useListOrganizations();
    if (organizations?.length === 1) {
        value.organizations = organizations;
    }

    return (
        <DashboardContext.Provider value={value}>
            {children}
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
