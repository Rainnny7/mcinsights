"use client";

import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useState, type ReactElement } from "react";
import { appConfig } from "../../app/config";
import request from "../../lib/request";
import { DownloadIcon } from "../animate-ui/icons/download";
import { AnimateIcon } from "../animate-ui/icons/icon";
import SimpleTooltip from "../simple-tooltip";
import Spinner from "../spinner";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const DownloadPluginButton = (): ReactElement => {
    const { isLoading, data } = useQuery<any>({
        queryKey: ["plugin-download"],
        queryFn: async () =>
            await request.get(
                `https://api.github.com/repos/${appConfig.githubUrl}/releases/latest`
            ),
    });
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const downloadUrl = data?.assets[0]?.browser_download_url;
    const downloadName = data?.assets[0]?.name;

    const handleDownload = async () => {
        setIsDownloading(true);

        // Get the blob for the latest jar release
        const response = await request.get<ArrayBuffer>(
            `https://cors.rainnny.club/${downloadUrl}`,
            {
                returns: "arraybuffer",
            }
        );
        if (!response) return;
        const url = window.URL.createObjectURL(
            new Blob([response], { type: "application/jar" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `${downloadName}`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Download */}
            <SimpleTooltip content="Download the latest plugin" side="bottom">
                <AnimateIcon animateOnHover>
                    <Button
                        className="w-fit gap-1"
                        variant="secondary"
                        disabled={isLoading || isDownloading}
                        onClick={handleDownload}
                    >
                        {isDownloading ? (
                            <Spinner />
                        ) : (
                            <DownloadIcon className="size-4" />
                        )}
                        Download{" "}
                        <span>
                            {isLoading ? (
                                <Skeleton className="w-20 h-4" />
                            ) : (
                                downloadName
                            )}
                        </span>
                    </Button>
                </AnimateIcon>
            </SimpleTooltip>

            {/* Setup Guide */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted text-sm text-muted-foreground rounded-lg">
                <InfoIcon className="mb-auto size-6" />
                <span>
                    To get started, download the latest plugin and place it in
                    your plugins folder. Once done, follow the instructions on
                    the server page to begin monitoring!
                </span>
            </div>
        </div>
    );
};
export default DownloadPluginButton;
