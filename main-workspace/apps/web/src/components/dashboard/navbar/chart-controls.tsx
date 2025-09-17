"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";
import { useDashboard } from "../../../provider/dashboard-provider";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { RefreshCwIcon } from "../../animate-ui/icons/refresh-cw";
import type { PresetTimeRange } from "../../chart/time-range-selector";
import ChartTimeRangeSelector from "../../chart/time-range-selector";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const timeRanges: PresetTimeRange[] = [
    { name: "Last Hour", min: "1h" },
    { name: "Last 12 Hours", min: "12h" },
    { name: "Last Day", min: "24h" },
    { name: "Last Week", min: "7d" },
    { name: "Last Month", min: "30d" },
    { name: "Last 3 Months", min: "90d" },
    { name: "Last 6 Months", min: "180d" },
    { name: "Last Year", min: "365d" },
];

const ChartControls = (): ReactElement => {
    const { timeRangeMin, timeRangeMax, updateTimeRange } = useDashboard();

    return (
        <div className="flex gap-2.5 items-center">
            <RefreshButton />

            <ChartTimeRangeSelector
                timeRanges={timeRanges}
                timeRangeMin={timeRangeMin}
                timeRangeMax={timeRangeMax}
                setTimeRange={updateTimeRange}
            />
        </div>
    );
};

const RefreshButton = (): ReactElement => {
    const utils = trpc.useContext();
    const [status, setStatus] = useState<"idle" | "refreshing" | "cooldown">(
        "idle"
    );

    const performRefresh = async () => {
        if (status !== "idle") return;
        setStatus("refreshing");
        await utils.metrics.queryMetrics.invalidate();
        setStatus("cooldown");
        setTimeout(() => setStatus("idle"), 1000);
        toast.success("Refreshed all metrics");
    };

    return (
        <SimpleTooltip content="Refresh all stats" side="bottom">
            <div>
                <AnimateIcon animateOnHover animate={status === "refreshing"}>
                    <Button
                        className="h-8"
                        variant="outline"
                        onClick={performRefresh}
                        disabled={status === "refreshing"}
                    >
                        <RefreshCwIcon className="size-3.5" />
                        <span>Refresh</span>
                    </Button>
                </AnimateIcon>
            </div>
        </SimpleTooltip>
    );
};

export default ChartControls;
