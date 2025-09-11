import type { ReactElement } from "react";
import type { PresetTimeRange } from "../../chart/time-range-selector";
import ChartTimeRangeSelector from "../../chart/time-range-selector";

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
    return (
        <div className="flex gap-1 items-center">
            <ChartTimeRangeSelector
                timeRanges={timeRanges}
                timeRangeMin="1h"
                timeRangeMax="12h"
                setTimeRange={() => {}}
            />
        </div>
    );
};
export default ChartControls;
