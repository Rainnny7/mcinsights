"use client";

import SearchInput from "@/components/dashboard/navbar/search";
import Link from "next/link";
import type { ReactElement } from "react";
import { ScreenSize, useIsScreenSize } from "../../../hooks/use-mobile";
import { useScrolled } from "../../../hooks/use-scrolled";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import type { User } from "../../../types/auth";
import ScaleInAnimation from "../../animation/scale-in-animation";
import AppLogo from "../../app-logo";
import { AnimatedThemeToggler } from "../../ui/animated-theme-toggler";
import { Separator } from "../../ui/separator";
import ChartControls from "./chart-controls";
import GitHubButton from "./github-button";
import HelpDropdown from "./help-dropdown";
import Links from "./links";
import NewDashboardButton from "./new-dashboard-button";
import OrganizationSwitcher from "./organization-switcher";
import UserDropdown from "./user-dropdown";

const DashboardNavbar = ({ user }: { user: User }): ReactElement => {
    const isSuperDuperSmall: boolean = useIsScreenSize(ScreenSize.ExtraSmall);
    const isMobile: boolean = useIsScreenSize(ScreenSize.Small);
    const { scrolled } = useScrolled();
    const { activeOrganization } = useDashboard();

    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 px-5 py-3.5 bg-muted/40 backdrop-blur-sm border-b border-border transition-all duration-300 ease-in-out transform-gpu z-50",
                scrolled && "py-2.5 h-12.5"
            )}
        >
            <div className="relative mx-auto max-w-screen-3xl flex flex-col gap-2.5">
                {/* Logo */}
                <ScaleInAnimation
                    className={cn(
                        "absolute left-0 -top-0.5",
                        scrolled && "-top-1"
                    )}
                >
                    <Link
                        className={cn(
                            "hidden hover:opacity-75 transition-opacity duration-300 transform-gpu",
                            !isMobile && "block"
                        )}
                        href="/dashboard"
                        draggable={false}
                    >
                        <AppLogo size={36} />
                    </Link>
                </ScaleInAnimation>

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
                        <ScaleInAnimation delay={0.1}>
                            <span
                                className={cn(
                                    "hidden text-2xl text-muted-foreground/35",
                                    !isMobile && "block"
                                )}
                            >
                                /
                            </span>
                        </ScaleInAnimation>
                        <ScaleInAnimation delay={0.2}>
                            <OrganizationSwitcher />
                        </ScaleInAnimation>
                    </div>

                    {/* Right */}
                    <div className="flex gap-2.5 items-center">
                        <ScaleInAnimation delay={0.2}>
                            <SearchInput />
                        </ScaleInAnimation>
                        {!isSuperDuperSmall && (
                            <ScaleInAnimation delay={0.3}>
                                <GitHubButton />
                            </ScaleInAnimation>
                        )}
                        <ScaleInAnimation delay={0.4}>
                            <HelpDropdown />
                        </ScaleInAnimation>
                        <ScaleInAnimation delay={0.5}>
                            <AnimatedThemeToggler />
                        </ScaleInAnimation>
                        <ScaleInAnimation delay={0.6}>
                            <Separator
                                orientation="vertical"
                                className="!h-6.5"
                            />
                        </ScaleInAnimation>
                        <ScaleInAnimation delay={0.6}>
                            <UserDropdown user={user} />
                        </ScaleInAnimation>
                    </div>
                </div>

                {/* Bottom */}
                <div
                    className={cn(
                        "translate-y-1.5 flex justify-between gap-5 items-center text-sm transition-all duration-300 ease-in-out transform-gpu",
                        scrolled && "-translate-y-11.5",
                        scrolled && !isMobile && "ml-10"
                    )}
                >
                    {/* Left - Links & New Dashboard Button */}
                    <div className="flex gap-2.5 items-center">
                        <Links />
                        {activeOrganization && (
                            <ScaleInAnimation delay={0.8}>
                                <NewDashboardButton />
                            </ScaleInAnimation>
                        )}
                    </div>

                    {/* Right - Actions */}
                    <div className="flex gap-2.5 items-center">
                        {/* Chart Controls */}
                        {activeOrganization && (
                            <ScaleInAnimation delay={0.7}>
                                <ChartControls />
                            </ScaleInAnimation>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
