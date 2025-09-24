import { DollarSignIcon, GlobeIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import { BellRingIcon } from "../../animate-ui/icons/bell-ring";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { LayoutDashboardIcon } from "../../animate-ui/icons/layout-dashboard";
import { MessageCircleIcon } from "../../animate-ui/icons/message-circle";
import { SettingsIcon } from "../../animate-ui/icons/settings";
import { UserIcon } from "../../animate-ui/icons/user";
import { UsersIcon } from "../../animate-ui/icons/users";
import ScaleInAnimation from "../../animation/scale-in-animation";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

type NavbarLink = {
    icon: ReactNode;
    label: string;
    tooltip: string;
    href: string;
    disabled?: boolean;
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
        icon: <LayoutDashboardIcon />,
        label: "Overview",
        tooltip: "Get an overview of your organization",
        href: "/dashboard/<org>",
    },
    {
        icon: <UsersIcon />,
        label: "Players",
        tooltip: "View players that have played on your server",
        href: "/dashboard/<org>/players",
        disabled: true,
    },
    {
        icon: <MessageCircleIcon />,
        label: "Chat",
        tooltip: "View the chat for a server",
        href: "/dashboard/<org>/chat",
        disabled: true,
    },
    {
        icon: <DollarSignIcon />,
        label: "Revenue",
        tooltip: "View revenue for your organization",
        href: "/dashboard/<org>/revenue",
        disabled: true,
    },
    {
        icon: <GlobeIcon />,
        label: "Domains",
        tooltip: "View analytics for domains players have used",
        href: "/dashboard/<org>/domains",
        disabled: true,
    },
    {
        icon: <BellRingIcon />,
        label: "Alerts",
        tooltip: "Manage alerts for your organization",
        href: "/dashboard/<org>/alerts",
        disabled: true,
    },
    {
        icon: <SettingsIcon />,
        label: "Settings",
        tooltip: "Manage settings for your organization",
        href: "/dashboard/<org>/settings",
    },
];

const Links = (): ReactElement => {
    const path: string = usePathname();
    const { activeOrganization } = useDashboard();

    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    // Update underline position when active tab changes
    useEffect(() => {
        if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
            const activeTab: HTMLDivElement | null =
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
        <div className="relative flex items-center">
            {allLinks.map((link: NavbarLink, index: number) => {
                const href: string = link.href.replace(
                    "<org>",
                    activeOrganization?.slug || ""
                );
                const active: boolean = path === href;
                return (
                    <div
                        key={link.label}
                        ref={(element) => {
                            tabRefs.current[index] = element;
                        }}
                    >
                        <ScaleInAnimation delay={index * 0.1}>
                            <SimpleTooltip
                                content={
                                    active || link.disabled
                                        ? undefined
                                        : link.tooltip
                                }
                                side="bottom"
                            >
                                <Link
                                    className={cn(
                                        link.disabled && "cursor-not-allowed"
                                    )}
                                    href={link.disabled ? "#" : href}
                                    draggable={false}
                                >
                                    <AnimateIcon animateOnHover>
                                        <Button
                                            className={cn(
                                                "relative text-muted-foreground transition-all duration-300 ease-in-out transform-gpu",
                                                active &&
                                                    "text-primary-foreground"
                                            )}
                                            variant="ghost"
                                            size="sm"
                                            disabled={link.disabled}
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
                        </ScaleInAnimation>
                    </div>
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
    );
};
export default Links;
