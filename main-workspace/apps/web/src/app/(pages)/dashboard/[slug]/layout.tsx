import type { Organization } from "better-auth/plugins/organization";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { getFullOrganization } from "../../../../lib/organization";

const OrganizationLayout = async ({
    params,
    children,
}: {
    params: Promise<{ slug: string }>;
    children: ReactNode;
}): Promise<ReactElement> => {
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
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
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
