"use client";

import type { User } from "better-auth";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useScrolled } from "../../../hooks/use-scrolled";
import { cn } from "../../../lib/utils";
import AppLogo from "../../app-logo";
import GitHubButton from "./github-button";
import HelpDropdown from "./help-dropdown";
import OrganizationSwitcher from "./organization-switcher";
import UserDropdown from "./user-dropdown";

type NavbarLink = {
    label: string;
    tooltip: string;
    href: string;
};

const links: NavbarLink[] = [];

const DashboardNavbar = ({ user }: { user: User }): ReactElement => {
    const { scrolled } = useScrolled(20);
    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 px-5 py-4 bg-muted/40 backdrop-blur-sm border-b border-border transition-all duration-300 ease-in-out transform-gpu z-50",
                scrolled && "py-2.5 h-12.5"
            )}
        >
            <div className="relative mx-auto max-w-screen-3xl">
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
                        <UserDropdown user={user} />
                    </div>
                </div>

                {/* Bottom Links */}
                <div
                    className={cn(
                        "mt-2.5 transition-all duration-300 ease-in-out transform-gpu",
                        scrolled && "-translate-y-10.5 translate-x-13"
                    )}
                >
                    sdfds
                </div>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
