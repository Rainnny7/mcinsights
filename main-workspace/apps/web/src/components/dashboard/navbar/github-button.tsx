"use client";

import { GitHubStarsButton } from "@/components/animate-ui/components/buttons/github-stars";
import Link from "next/link";
import type { ReactElement } from "react";
import { appConfig } from "../../../app/config";
import SimpleTooltip from "../../simple-tooltip";

const GitHubButton = (): ReactElement => {
    const [owner, repo] = appConfig.githubUrl.split("/");
    return (
        <SimpleTooltip content="View the source on GitHub" side="bottom">
            <Link
                href={`https://github.com/${appConfig.githubUrl}`}
                target="_blank"
                draggable={false}
            >
                <GitHubStarsButton
                    className="h-8 border border-border rounded-xl"
                    variant="ghost"
                    username={owner}
                    repo={repo}
                />
            </Link>
        </SimpleTooltip>
    );
};
export default GitHubButton;
