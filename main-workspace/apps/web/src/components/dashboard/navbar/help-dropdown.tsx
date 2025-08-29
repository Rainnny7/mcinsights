"use client";

import {
    BookOpenIcon,
    ExternalLinkIcon,
    FileDownIcon,
    FolderIcon,
    type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { appConfig } from "../../../app/config";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

type HelpLink = {
    icon: LucideIcon | string;
    label: string;
    href: string;
};

const links: HelpLink[] = [
    {
        icon: "/media/logo/discord.png",
        label: "Join our Discord",
        href: "https://discord.mcmetrics.xyz",
    },
    {
        icon: FileDownIcon,
        label: "Plugin Download",
        href: `https://github.com/${appConfig.githubUrl}/releases`,
    },
    {
        icon: FolderIcon,
        label: "Documentation",
        href: "https://docs.mcmetrics.xyz",
    },
];

const HelpDropdown = (): ReactElement => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div>
                <SimpleTooltip content="View the documentation" side="bottom">
                    <Button
                        className="size-8.5 border border-border rounded-full"
                        variant="ghost"
                        size="icon"
                    >
                        <BookOpenIcon className="size-4.5" />
                    </Button>
                </SimpleTooltip>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-52 rounded-lg"
            align="end"
            side="bottom"
            sideOffset={8}
        >
            {/* Links */}
            <DropdownMenuGroup>
                {links.map((link: HelpLink) => {
                    const isExternal = link.href.startsWith("http");
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            target={isExternal ? "_blank" : undefined}
                            draggable={false}
                        >
                            <DropdownMenuItem>
                                {typeof link.icon === "string" ? (
                                    <Image
                                        src={link.icon}
                                        alt={link.label}
                                        width={16}
                                        height={16}
                                        draggable={false}
                                    />
                                ) : (
                                    <link.icon className="size-4" />
                                )}
                                <span>{link.label}</span>
                                {isExternal && (
                                    <ExternalLinkIcon className="ml-auto size-4 text-muted-foreground" />
                                )}
                            </DropdownMenuItem>
                        </Link>
                    );
                })}
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
);
export default HelpDropdown;
