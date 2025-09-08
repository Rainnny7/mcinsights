"use client";

import type { User } from "better-auth";
import { BuildingIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { logoutUser } from "../../../lib/user";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { LogOutIcon } from "../../animate-ui/icons/log-out";
import { UserIcon } from "../../animate-ui/icons/user";
import { Button } from "../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import ShimmerButton from "../../ui/shimmer";
import UserAvatar from "../user-avatar";

type DropdownItem = {
    icon: ReactNode;
    label: string;
    href: string;
};

const items: DropdownItem[] = [
    {
        icon: <UserIcon />,
        label: "Account Settings",
        href: "/dashboard/account",
    },
    { icon: <BuildingIcon />, label: "My Organizations", href: "/dashboard" },
];

const UserDropdown = ({ user }: { user: User }): ReactElement => {
    const path: string = usePathname();
    const { activeOrganization } = useDashboard();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <ShimmerButton className="size-fit rounded-full">
                        <Button
                            className="size-fit rounded-full"
                            variant="ghost"
                            size="icon"
                        >
                            <UserAvatar user={user} className="size-8" />
                        </Button>
                    </ShimmerButton>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-52 rounded-lg"
                align="end"
                side="bottom"
                sideOffset={16}
            >
                {/* User Info */}
                <DropdownMenuLabel className="mb-2 p-0">
                    <div className="px-1 py-1.5 flex gap-2.5 items-center text-left text-sm">
                        <ShimmerButton className="size-fit rounded-full">
                            <UserAvatar user={user} />
                        </ShimmerButton>

                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate text-accent-foreground font-medium">
                                {user.name}
                            </span>
                            <span className="truncate text-xs blur-[2.5px] hover:blur-none transition-all duration-300 transform-gpu">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Items */}
                <DropdownMenuGroup>
                    {items.map((item: DropdownItem) => {
                        const href: string = item.href.replace(
                            "<org>",
                            activeOrganization?.slug || ""
                        );
                        const active: boolean = path === href;
                        return (
                            <Link
                                key={item.label}
                                href={href}
                                draggable={false}
                            >
                                <AnimateIcon animateOnHover>
                                    <DropdownMenuItem>
                                        <span
                                            className={cn(
                                                "size-4",
                                                active && "*:!text-primary"
                                            )}
                                        >
                                            {item.icon}
                                        </span>
                                        <span
                                            className={cn(
                                                active && "text-white"
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </DropdownMenuItem>
                                </AnimateIcon>
                            </Link>
                        );
                    })}
                </DropdownMenuGroup>

                {/* Logout */}
                <DropdownMenuSeparator />
                <AnimateIcon animateOnHover>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={logoutUser}
                    >
                        <LogOutIcon className="rotate-180 size-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </AnimateIcon>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default UserDropdown;
