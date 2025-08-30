"use client";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Organization } from "better-auth/plugins/organization";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { env } from "../../../lib/env";
import { useDashboard } from "../../../provider/dashboard-provider";
import SimpleTooltip from "../../simple-tooltip";
import OrganizationAvatar from "../organization-avatar";

const OrganizationList = (): ReactElement => {
    const { organizations } = useDashboard();
    return !organizations.length ? (
        <div className="flex justify-center items-center">
            <NoOrganizations />
        </div>
    ) : (
        <div className="flex flex-wrap gap-3 items-center *:h-20">
            {organizations.map((organization: Organization) => (
                <OrganizationCard
                    key={organization.id}
                    organization={organization}
                />
            ))}
            <NewOrganizationCard />
        </div>
    );
};

const NoOrganizations = (): ReactElement => (
    <div className="h-90 flex flex-col justify-center gap-4 items-center">
        <Image
            src="/media/static-tv.gif"
            alt="Static TV"
            width={196}
            height={196}
            draggable={false}
        />
        <span className="max-w-xs text-sm text-muted-foreground text-center">
            You don&apos;t have any organizations yet.{" "}
            <span className="text-primary">Create one</span> to get started
            monitoring!
        </span>
    </div>
);

const OrganizationCard = ({
    organization,
}: {
    organization: Organization;
}): ReactElement => (
    <SimpleTooltip content={`View ${organization.name}`} side="bottom">
        <Link href={`/dashboard/${organization.slug}`} draggable={false}>
            <Card className="p-2 w-90 hover:bg-card transition-all duration-300 ease-in-out transform-gpu">
                {/* Header */}
                <CardHeader className="p-2 flex gap-3 items-center">
                    <OrganizationAvatar
                        className="size-9"
                        organization={organization}
                    />
                    <div className="flex flex-col">
                        <CardTitle className="text-base">
                            {organization.name}
                        </CardTitle>
                        <CardDescription>
                            {new URL(env.NEXT_PUBLIC_BASE_URL).hostname}
                            /dashboard/{organization.slug}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    </SimpleTooltip>
);

const NewOrganizationCard = (): ReactElement => (
    <SimpleTooltip content="Create a new organization" side="bottom">
        <Card className="p-2 w-90 bg-card/80 hover:bg-card border-dashed border-2 border-muted-foreground/20 transition-all duration-300 ease-in-out transform-gpu">
            {/* Header */}
            <CardHeader className="p-2">
                <CardTitle className="text-base">New Organization</CardTitle>
                <CardDescription>Create a new organization</CardDescription>
            </CardHeader>
        </Card>
    </SimpleTooltip>
);

export default OrganizationList;
