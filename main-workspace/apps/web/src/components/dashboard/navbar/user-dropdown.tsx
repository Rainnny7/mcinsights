"use client";

import type { User } from "better-auth";
import { GithubIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { appConfig } from "../../../app/config";
import { logoutUser } from "../../../lib/user";
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
import UserAvatar from "../user-avatar";

const UserDropdown = ({ user }: { user: User }): ReactElement => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                className="size-fit rounded-full"
                variant="ghost"
                size="icon"
            >
                <UserAvatar user={user} className="size-7" />
            </Button>
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
                    <UserAvatar user={user} />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-white font-medium">
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
                {/* GitHub */}
                <Link
                    href={`https://github.com/${appConfig.githubUrl}`}
                    target="_blank"
                    draggable={false}
                >
                    <DropdownMenuItem>
                        <GithubIcon className="size-4" />
                        <span>View on GitHub</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>

            {/* Logout */}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logoutUser}>
                <LogOutIcon className="rotate-180 size-4" />
                <span>Logout</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
export default UserDropdown;
