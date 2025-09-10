"use client";

import type { User } from "better-auth";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import type { ReactElement } from "react";
import { ScreenSize, useIsScreenSize } from "../../../hooks/use-mobile";
import { useScrolled } from "../../../hooks/use-scrolled";
import { cn } from "../../../lib/utils";
import AppLogo from "../../app-logo";
import { AnimatedThemeToggler } from "../../ui/animated-theme-toggler";
import { Separator } from "../../ui/separator";
import GitHubButton from "./github-button";
import HelpDropdown from "./help-dropdown";
import Links from "./links";
import OrganizationSwitcher from "./organization-switcher";
import ScrollToTopIndicator from "./scroll-to-top-indicator";
import UserDropdown from "./user-dropdown";

const DashboardNavbar = ({ user }: { user: User }): ReactElement => {
    const isSuperDuperSmall: boolean = useIsScreenSize(ScreenSize.ExtraSmall);
    const isMobile: boolean = useIsScreenSize(ScreenSize.Small);
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
                        "hidden absolute left-0 -top-0.5 hover:opacity-75 transition-opacity duration-300 transform-gpu",
                        !isMobile && "block",
                        scrolled && "-top-1.5"
                    )}
                    href="/dashboard"
                    draggable={false}
                >
                    <AppLogo size={36} />
                </Link>

                {/* Top */}
                <div
                    className={cn(
                        "flex justify-between gap-3.5 items-center transition-all duration-300 ease-in-out transform-gpu",
                        !isMobile && "ml-12",
                        scrolled
                            ? "opacity-0 -translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0"
                    )}
                >
                    {/* Left */}
                    <div className="flex gap-2.5 items-center">
                        <span
                            className={cn(
                                "hidden text-2xl text-muted-foreground/35",
                                !isMobile && "block"
                            )}
                        >
                            /
                        </span>
                        <OrganizationSwitcher />
                    </div>

                    {/* Right */}
                    <div className="flex gap-2.5 items-center">
                        {!isSuperDuperSmall && <GitHubButton />}
                        <HelpDropdown />
                        <AnimatedThemeToggler />
                        <Separator orientation="vertical" className="!h-6.5" />
                        <UserDropdown user={user} />
                    </div>
                </div>

                {/* Bottom */}
                <div
                    className={cn(
                        "translate-y-1.5 flex justify-between items-center text-sm transition-all duration-300 ease-in-out transform-gpu",
                        scrolled && "-translate-y-11.5",
                        scrolled && !isMobile && "ml-13"
                    )}
                >
                    {/* Left - Links */}
                    <Links />

                    {/* Right - Actions */}
                    <div className="flex gap-2.5 items-center">
                        {/* Scroll to top indicator */}
                        <AnimatePresence>
                            {scrolled && <ScrollToTopIndicator />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
