"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState, type ReactElement } from "react";
import { appConfig } from "../../app/config";
import { GradientText } from "../animate-ui/primitives/texts/gradient";
import AppLogo from "../app-logo";
import SimpleTooltip from "../simple-tooltip";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

type FooterLink = {
    label: string;
    tooltip: string;
    href: string;
};

const links: FooterLink[] = [
    {
        label: "Home",
        tooltip: "Go to the home page",
        href: "/dashboard",
    },
    {
        label: "Source",
        tooltip: "View the source code on GitHub",
        href: `https://github.com/${appConfig.githubUrl}`,
    },
    {
        label: "Discord",
        tooltip: "Join our Discord server",
        href: "https://discord.mcmetrics.xyz",
    },
    {
        label: "Docs",
        tooltip: "View the documentation",
        href: "https://docs.mcmetrics.xyz",
    },
];

const DashboardFooter = (): ReactElement => (
    <footer className="relative mt-auto px-5 py-4 sm:py-3.5 bg-muted/40 text-sm text-muted-foreground/75 font-medium backdrop-blur-sm border-t border-border overflow-hidden">
        {/* Top Left Radial Gradient */}
        <div className="absolute -top-36 -left-36 w-[26rem] h-[20rem] bg-radial-[at_center] from-primary/30 via-transparent to-transparent blur-md rounded-full opacity-15 -z-10" />

        {/* Bottom Right Radial Gradient */}
        <div className="absolute -bottom-36 -right-36 w-[26rem] h-[20rem] bg-radial-[at_center] from-primary/30 via-transparent to-transparent blur-md rounded-full opacity-7 -z-10" />

        <div className="px-5 mx-auto max-w-screen-2xl w-full flex flex-col sm:flex-row gap-4 sm:gap-3 justify-between items-center">
            {/* Branding */}
            <div className="flex gap-3 items-center">
                <Link
                    className="hover:opacity-75 transition-opacity duration-300 transform-gpu"
                    href="/dashboard"
                    draggable={false}
                >
                    <AppLogo size={40} />
                </Link>

                {/* Hehe */}
                <div className="flex flex-col gap-1 text-xs text-muted-foreground/60">
                    <AnimatedLine initialDashes={23} reverseDirection={false} />
                    <span className="relative">
                        | Made with <span className="animate-pulse">💚</span> by{" "}
                        <SimpleTooltip content="View my website (:" side="top">
                            <Link
                                className="text-primary hover:opacity-75 transition-opacity duration-300 transform-gpu"
                                href="https://rainnny.club"
                                target="_blank"
                                draggable={false}
                            >
                                <GradientText text="Rainnny" />
                            </Link>
                        </SimpleTooltip>{" "}
                        <span className="absolute right-0">|</span>
                    </span>
                    <AnimatedLine initialDashes={23} reverseDirection />
                </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 justify-center items-center">
                {links.map((link: FooterLink) => {
                    const isExternal: boolean = link.href.startsWith("http");
                    return (
                        <SimpleTooltip
                            key={link.label}
                            content={link.tooltip}
                            side="top"
                        >
                            <Link
                                className="group relative flex gap-1 items-center hover:opacity-75 transition-opacity duration-300 transform-gpu"
                                href={link.href}
                                target={isExternal ? "_blank" : undefined}
                                draggable={false}
                            >
                                <span>{link.label}</span>
                                {isExternal && (
                                    <ExternalLinkIcon className="opacity-0 absolute top-1/2 -translate-y-1/2 -right-4.5 size-3.5 text-muted-foreground group-hover:opacity-75 transition-opacity duration-300 transform-gpu" />
                                )}
                            </Link>
                        </SimpleTooltip>
                    );
                })}
                <AnimatedThemeToggler />
            </div>
        </div>
    </footer>
);

const AnimatedLine = memo(
    ({
        initialDashes = 12,
        reverseDirection = false,
    }: {
        initialDashes?: number;
        reverseDirection?: boolean;
    }) => {
        const [dashes, setDashes] = useState(
            reverseDirection ? 0 : initialDashes
        );
        const [direction, setDirection] = useState<"left" | "right">(
            reverseDirection ? "right" : "left"
        );

        useEffect(() => {
            const interval = setInterval(() => {
                setDashes((prev) => {
                    if (prev <= 0) {
                        setDirection("right");
                        return 1;
                    }
                    if (prev >= initialDashes) {
                        setDirection("left");
                        return initialDashes - 1;
                    }
                    return direction === "left" ? prev - 1 : prev + 1;
                });
            }, 70);

            return () => clearInterval(interval);
        }, [direction, initialDashes]);

        const generateLine = () => {
            const leftDashes = "-".repeat(dashes);
            const rightDashes = "-".repeat(initialDashes - dashes);
            return `|${leftDashes}${
                direction === "left" ? "<" : ">"
            }${rightDashes}|`;
        };

        return <span>{generateLine()}</span>;
    }
);

AnimatedLine.displayName = "AnimatedLine";

export default DashboardFooter;
