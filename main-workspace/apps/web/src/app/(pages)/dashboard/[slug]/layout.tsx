import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getFullOrganization } from "../../../../lib/organization";

const OrganizationLayout = async ({
    params,
    children,
}: LayoutProps<"/dashboard/[slug]">): Promise<ReactElement> => {
    // Ensure the organization with the given slug exists
    const { slug } = await params;
    const organization: Organization | undefined = await getFullOrganization(
        slug
    );
    if (!organization) notFound();

    return <main>{children}</main>;
};

export const generateMetadata = async ({
    params,
}: LayoutProps<"/dashboard/[slug]">): Promise<Metadata> => {
    const { slug } = await params;
    const organization: Organization | undefined = await getFullOrganization(
        slug
    );
    if (!organization) notFound();
    const { logo } = organization;

    return {
        icons: logo ? { icon: logo, apple: logo } : {},
    };
};

export default OrganizationLayout;
