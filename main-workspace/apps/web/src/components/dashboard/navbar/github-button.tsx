"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { appConfig } from "../../../app/config";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const GitHubButton = (): ReactElement => (
    <SimpleTooltip content="View the source on GitHub" side="bottom">
        <Link
            href={`https://github.com/${appConfig.githubUrl}`}
            target="_blank"
            draggable={false}
        >
            <Button
                className="size-8.5 border border-border rounded-full"
                variant="ghost"
                size="icon"
            >
                <GithubIcon className="size-4.5" />
            </Button>
        </Link>
    </SimpleTooltip>
);
export default GitHubButton;
