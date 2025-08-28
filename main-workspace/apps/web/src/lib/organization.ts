import type { Organization } from "better-auth/plugins/organization";
import { cookies } from "next/headers";
import { authClient } from "./auth-client";

/**
 * Get the organization with full details by
 * the given slug that the user is a member of.
 *
 * @param slug the slug of the organization
 * @returns the organization with full details, undefined if none
 */
export const getFullOrganization = async (
    slug: string
): Promise<Organization | undefined> => {
    const { data } = await authClient.organization.getFullOrganization({
        query: {
            organizationSlug: slug,
            membersLimit: 100,
        },
        fetchOptions: {
            headers: {
                cookie: (await cookies()).toString(),
            },
        },
    });
    return data ?? undefined;
};
