"use client";

import type { User } from "better-auth";
import { ArrowUpIcon, DollarSignIcon, HomeIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ScreenSize, useIsScreenSize } from "../../../hooks/use-mobile";
import { useScrolled } from "../../../hooks/use-scrolled";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import { ActivityIcon } from "../../animate-ui/icons/activity";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { SettingsIcon } from "../../animate-ui/icons/settings";
import { UserIcon } from "../../animate-ui/icons/user";
import { UsersIcon } from "../../animate-ui/icons/users";
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
    icon: ReactNode;
    label: string;
    tooltip: string;
    href: string;
};

const links: NavbarLink[] = [
    {
        icon: <UserIcon />,
        label: "Account",
        tooltip: "Manage your account",
        href: "/dashboard/account",
    },
];

const organizationLinks: NavbarLink[] = [
    {
        icon: <ActivityIcon />,
        label: "Overview",
        tooltip: "Get an overview of your organization",
        href: "/dashboard/<org>",
    },
    {
        icon: <UsersIcon />,
        label: "Players",
        tooltip: "View players that have played on your server",
        href: "/dashboard/<org>/players",
    },
    {
        icon: <DollarSignIcon />,
        label: "Revenue",
        tooltip: "View revenue for your organization",
        href: "/dashboard/<org>/revenue",
    },
    {
        icon: <SettingsIcon />,
        label: "Settings",
        tooltip: "Manage settings for your organization",
        href: "/dashboard/<org>/settings",
    },
];

const DashboardNavbar = ({ user }: { user: User }): ReactElement => {
    const path: string = usePathname();
    const isMobile: boolean = useIsScreenSize(ScreenSize.ExtraSmall);
    const { activeOrganization } = useDashboard();
    const { scrolled } = useScrolled(20);

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });

    // Get all navigation links
    const allLinks: NavbarLink[] = [
        {
            icon: <HomeIcon />,
            label: "Home",
            tooltip: "Go to the dashboard",
            href: "/dashboard",
        },
        ...(activeOrganization ? organizationLinks : links),
    ];

    // Find the active link index
    const activeIndex: number = allLinks.findIndex(
        (link: NavbarLink) =>
            path === link.href.replace("<org>", activeOrganization?.slug || "")
    );

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Update underline position when active tab changes
    useEffect(() => {
        if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
            const activeTab: HTMLButtonElement | null =
                tabRefs.current[activeIndex];
            const container: HTMLElement | null | undefined =
                activeTab?.parentElement?.parentElement;

            if (activeTab && container) {
                const tabRect: DOMRect = activeTab.getBoundingClientRect();
                const containerRect: DOMRect =
                    container.getBoundingClientRect();

                setUnderlineStyle({
                    width: tabRect.width,
                    left: tabRect.left - containerRect.left,
                });
            }
        }
    }, [activeIndex, path, activeOrganization]);

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
                        scrolled && "-top-1"
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
                        {!isMobile && <GitHubButton />}
                        <HelpDropdown />
                        <AnimatedThemeToggler />
                        <Separator orientation="vertical" className="!h-6.5" />
                        <UserDropdown user={user} />
                    </div>
                </div>

                {/* Bottom Links */}
                <div
                    className={cn(
                        "relative translate-y-1.5 text-sm transition-all duration-300 ease-in-out transform-gpu",
                        scrolled && "-translate-y-11",
                        scrolled && !isMobile && "translate-x-13"
                    )}
                >
                    {allLinks.map((link: NavbarLink, index: number) => {
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
                                    <AnimateIcon animateOnHover>
                                        <Button
                                            ref={(el) => {
                                                tabRefs.current[index] = el;
                                            }}
                                            className={cn(
                                                "relative text-muted-foreground transition-all duration-300 ease-in-out transform-gpu",
                                                active &&
                                                    "text-primary-foreground"
                                            )}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <span
                                                className={cn(
                                                    "size-4",
                                                    active && "text-primary"
                                                )}
                                            >
                                                {link.icon}
                                            </span>
                                            <span>{link.label}</span>
                                        </Button>
                                    </AnimateIcon>
                                </Link>
                            </SimpleTooltip>
                        );
                    })}

                    {/* Active tab underline */}
                    <div
                        className="absolute -bottom-2 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out transform-gpu"
                        style={{
                            width: `${underlineStyle.width}px`,
                            left: `${underlineStyle.left}px`,
                        }}
                    />
                </div>

                {/* Scroll to top indicator */}
                <AnimatePresence>
                    {scrolled && (
                        <motion.div
                            className="absolute -top-0.5 -right-0.5"
                            initial={{ opacity: 0, y: -10, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.5 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            <SimpleTooltip
                                content="Bring me to the top"
                                side="bottom"
                            >
                                <Button
                                    className="size-7.5 border border-border rounded-full"
                                    variant="ghost"
                                    size="icon"
                                    onClick={scrollToTop}
                                >
                                    <ArrowUpIcon className="size-4" />
                                </Button>
                            </SimpleTooltip>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
