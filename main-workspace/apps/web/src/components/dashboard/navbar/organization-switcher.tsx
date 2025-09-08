"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Organization } from "better-auth/plugins";
import { BuildingIcon, CheckIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { useDashboard } from "../../../provider/dashboard-provider";
import { ChevronUpDownIcon } from "../../animate-ui/icons/chevron-up-down";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { PlusIcon } from "../../animate-ui/icons/plus";
import OrganizationAvatar from "../organization-avatar";

type OrganizationSwitcherProps = {
    children?: ReactNode | undefined;
};

const OrganizationSwitcher = ({
    children,
}: OrganizationSwitcherProps): ReactElement => {
    const { activeOrganization, organizations } = useDashboard();
    return (
        <DropdownMenu>
            {/* Trigger */}
            <AnimateIcon animateOnHover>
                <DropdownMenuTrigger asChild>
                    {children ?? (
                        <Button className="w-fit h-7 !px-1.5" variant="ghost">
                            {activeOrganization ? (
                                <OrganizationAvatar
                                    organization={activeOrganization}
                                    className="size-5.5"
                                />
                            ) : (
                                <BuildingIcon className="size-4.5 text-muted-foreground" />
                            )}

                            <span className="truncate font-medium">
                                {activeOrganization
                                    ? activeOrganization.name
                                    : "Select organization"}
                            </span>
                            <ChevronUpDownIcon className="size-4 opacity-50" />
                        </Button>
                    )}
                </DropdownMenuTrigger>
            </AnimateIcon>

            {/* Organizations */}
            <DropdownMenuContent
                className="w-64 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={8}
            >
                <DropdownMenuLabel className="mb-1 flex gap-1.5 items-center text-muted-foreground text-xs">
                    <BuildingIcon className="size-4" />
                    <span>Organizations</span>
                </DropdownMenuLabel>

                {/* Organizations */}
                {organizations.map((organization: Organization) => (
                    <Link
                        key={organization.id}
                        href={`/dashboard/${organization.slug}`}
                        draggable={false}
                    >
                        <DropdownMenuItem className="group gap-2 p-2">
                            <OrganizationAvatar
                                organization={organization}
                                className="size-6"
                            />
                            {organization.name}

                            {/* Indicator */}
                            <span className="ml-auto">
                                {activeOrganization?.id === organization.id ? (
                                    <CheckIcon className="size-4 text-primary" />
                                ) : (
                                    <ChevronRightIcon className="opacity-0 size-4 text-muted-foreground group-hover:opacity-100 transition-opacity duration-300 transform-gpu" />
                                )}
                            </span>
                        </DropdownMenuItem>
                    </Link>
                ))}

                {/* Create Organization */}
                <DropdownMenuSeparator />
                <AnimateIcon animateOnHover>
                    <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-6 items-center justify-center bg-muted-foreground/25 backdrop-blur-sm rounded-full border border-dotted border-muted-foreground/50">
                            <PlusIcon className="size-4" />
                        </div>
                        <div className="text-muted-foreground font-medium">
                            New Organization
                        </div>
                    </DropdownMenuItem>
                </AnimateIcon>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default OrganizationSwitcher;
