"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { appConfig } from "../../../app/config";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const GitHubButton = (): ReactElement => {
    const { theme } = useTheme();
    return (
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
                    <Image
                        src={`/media/logo/${
                            theme === "light" ? "github-dark" : "github"
                        }.png`}
                        alt="GitHub"
                        width={22}
                        height={22}
                        draggable={false}
                    />
                </Button>
            </Link>
        </SimpleTooltip>
    );
};
export default GitHubButton;
