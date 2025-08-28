import type { ReactElement } from "react";

import Image from "next/image";
import Link from "next/link";
import { appConfig } from "../../../app/config";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const GitHubButton = (): ReactElement => (
    <SimpleTooltip content="View the source on GitHub" side="bottom">
        <Link
            className="relative"
            href={`https://github.com/${appConfig.githubUrl}`}
            target="_blank"
            draggable={false}
        >
            {/* Stars Overlay */}
            <div />

            <Button
                className="size-8.5 border border-border rounded-full"
                variant="ghost"
                size="icon"
            >
                <Image
                    src="/media/logo/github.png"
                    alt="GitHub"
                    width={22}
                    height={22}
                    draggable={false}
                />
            </Button>
        </Link>
    </SimpleTooltip>
);
export default GitHubButton;
