"use client";

import { LogOutIcon } from "lucide-react";
import type { ReactElement } from "react";
import { logoutUser } from "../../lib/user";
import SimpleTooltip from "../simple-tooltip";

const LogoutButton = (): ReactElement => (
    <span className="flex gap-1 items-center text-sm text-muted-foreground/75">
        Not you?{" "}
        <SimpleTooltip content="Logout of your account" side="bottom">
            <span
                className="flex gap-1 items-center text-destructive/85 cursor-pointer hover:opacity-75 transition-opacity duration-300 transform-gpu"
                onClick={logoutUser}
            >
                <LogOutIcon className="rotate-180 size-4" />
                Logout
            </span>
        </SimpleTooltip>
    </span>
);
export default LogoutButton;
