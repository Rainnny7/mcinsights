"use client";

import type { User } from "better-auth";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { useScrolled } from "../../../hooks/use-scrolled";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import AppLogo from "../../app-logo";
import SimpleTooltip from "../../simple-tooltip";
import { AnimatedThemeToggler } from "../../ui/animated-theme-toggler";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import GitHubButton from "./github-button";
import HelpDropdown from "./help-dropdown";
import OrganizationSwitcher from "./organization-switcher";
import UserDropdown from "./user-dropdown";

type NavbarLink = {
    label: string;
    tooltip: string;
    href: string;
};

const links: NavbarLink[] = [
    {
        label: "Account",
        tooltip: "Manage your account",
        href: "/dashboard/account",
    },
];

const organizationLinks: NavbarLink[] = [
    {
        label: "Overview",
        tooltip: "Get an overview of your organization",
        href: "/dashboard/<org>",
    },
    {
        label: "Players",
        tooltip: "View players that have played on your server",
        href: "/dashboard/<org>/players",
    },
    {
        label: "Members",
        tooltip: "Manage members of your organization",
        href: "/dashboard/<org>/members",
    },
    {
        label: "Settings",
        tooltip: "Manage settings for your organization",
        href: "/dashboard/<org>/settings",
    },
];

const DashboardNavbar = ({ user }: { user: User }): ReactElement => {
    const path: string = usePathname();
    const { activeOrganization } = useDashboard();
    const { scrolled } = useScrolled(20);
    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 px-5 py-3.5 bg-muted/40 backdrop-blur-sm border-b border-border transition-all duration-300 ease-in-out transform-gpu z-50",
                scrolled && "py-2.5 h-12.5"
            )}
        >
            <div className="relative mx-auto max-w-screen-3xl flex flex-col gap-2.5">
                {/* Logo */}
                <Link
                    className={cn(
                        "absolute left-0 -top-0.5 hover:opacity-75 transition-opacity duration-300 transform-gpu",
                        scrolled && "-top-1"
                    )}
                    href="/dashboard"
                    draggable={false}
                >
                    <AppLogo size={36} />
                </Link>

                {/* Top */}
                <div
                    className={`ml-12 flex justify-between gap-3.5 items-center transition-all duration-300 ease-in-out transform-gpu ${
                        scrolled
                            ? "opacity-0 -translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0"
                    }`}
                >
                    {/* Left */}
                    <div className="flex gap-2.5 items-center">
                        <SlashIcon className="size-4 text-muted-foreground/35" />
                        <OrganizationSwitcher />
                    </div>

                    {/* Right */}
                    <div className="flex gap-2.5 items-center">
                        <GitHubButton />
                        <HelpDropdown />
                        <AnimatedThemeToggler />
                        <Separator orientation="vertical" className="!h-6.5" />
                        <UserDropdown user={user} />
                    </div>
                </div>

                {/* Bottom Links */}
                <div
                    className={cn(
                        "translate-y-1.5 flex items-center text-sm transition-all duration-300 ease-in-out transform-gpu",
                        scrolled && "-translate-y-11 translate-x-13"
                    )}
                >
                    {[
                        {
                            label: "Home",
                            tooltip: "Go to the dashboard",
                            href: "/dashboard",
                        },
                        ...(activeOrganization ? organizationLinks : links),
                    ].map((link: NavbarLink) => {
                        const href: string = link.href.replace(
                            "<org>",
                            activeOrganization?.slug || ""
                        );
                        const active: boolean = path === href;
                        return (
                            <SimpleTooltip
                                key={link.label}
                                content={active ? undefined : link.tooltip}
                                side="bottom"
                            >
                                <Link href={href} draggable={false}>
                                    <Button
                                        className={cn(
                                            "relative text-muted-foreground transition-all duration-300 ease-in-out transform-gpu",
                                            active && "text-primary-foreground"
                                        )}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <span>{link.label}</span>

                                        {/* Underline */}
                                        <div
                                            className={cn(
                                                "absolute -bottom-2 inset-x-0 h-0.5 opacity-0 bg-primary rounded-full transition-all duration-300 ease-in-out transform-gpu",
                                                active && "opacity-100"
                                            )}
                                        />
                                    </Button>
                                </Link>
                            </SimpleTooltip>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
