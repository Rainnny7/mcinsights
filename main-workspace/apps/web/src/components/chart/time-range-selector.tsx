"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useState, type ReactElement } from "react";
import { DATE_FORMATS, formatDate } from "../../../../api/src/lib/date";
import { ClockIcon } from "../animate-ui/icons/clock";
import { AnimateIcon } from "../animate-ui/icons/icon";
import SimpleTooltip from "../simple-tooltip";

type ChartTimeRangeSelectorProps = {
    timeRanges: PresetTimeRange[];
    timeRangeMin: string;
    timeRangeMax: string | undefined;
    setTimeRange: (
        timeRangeMin: string,
        timeRangeMax: string | undefined
    ) => void;
};

export type PresetTimeRange = {
    name: string;
    min: string;
};

const ChartTimeRangeSelector = ({
    timeRanges,
    timeRangeMin,
    timeRangeMax,
    setTimeRange,
}: ChartTimeRangeSelectorProps): ReactElement => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectedTimeRange: PresetTimeRange | undefined = timeRanges.find(
        (timeRange: PresetTimeRange) => timeRange.min === timeRangeMin
    );

    // Build the label based on the time range
    let label: string = "Select Time Range";
    if (timeRangeMin && timeRangeMax && timeRangeMin !== timeRangeMax) {
        // Date - Date
        label = `${formatDate(
            new Date(timeRangeMin),
            DATE_FORMATS.SHORT_DATE
        )} to ${formatDate(new Date(timeRangeMax), DATE_FORMATS.SHORT_DATE)}`;
    } else if (timeRangeMin.length < 5) {
        // Preset Time Range
        label = selectedTimeRange?.name ?? label;
    } else {
        // Single Date
        label = formatDate(new Date(timeRangeMin), DATE_FORMATS.SHORT_DATE);
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div>
                    <SimpleTooltip
                        content="Change the time range"
                        side="bottom"
                    >
                        <AnimateIcon animateOnHover>
                            <Button
                                className="min-w-32"
                                variant="outline"
                                size="sm"
                            >
                                <ClockIcon className="size-3.5" />
                                {label}

                                <div className="p-1 bg-muted rounded-lg border border-muted-foreground/10">
                                    <ChevronRightIcon
                                        className={cn(
                                            "size-3.5 transition-transform duration-300 transform-gpu",
                                            isOpen && "rotate-90"
                                        )}
                                    />
                                </div>
                            </Button>
                        </AnimateIcon>
                    </SimpleTooltip>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-fit mr-24 flex gap-6 justify-between"
                sideOffset={12}
            >
                {/* Date Range Selector */}
                <DateRangeSelector
                    timeRangeMin={timeRangeMin}
                    timeRangeMax={timeRangeMax}
                    setTimeRange={setTimeRange}
                />

                <Separator className="!h-74" orientation="vertical" />

                {/* Preset Time Ranges */}
                <PresetTimeRangeSelector
                    selectedTimeRange={selectedTimeRange}
                    timeRanges={timeRanges}
                    setTimeRange={setTimeRange}
                />
            </PopoverContent>
        </Popover>
    );
};

const DateRangeSelector = ({
    timeRangeMin,
    timeRangeMax,
    setTimeRange,
}: {
    timeRangeMin: string;
    timeRangeMax: string | undefined;
    setTimeRange: (
        timeRangeMin: string,
        timeRangeMax: string | undefined
    ) => void;
}): ReactElement => (
    <div className="bg-input/30 rounded-lg border border-input backdrop-blur-sm shadow-sm">
        <Calendar
            className="rounded-lg border shadow-sm"
            mode="range"
            numberOfMonths={2}
            selected={{
                from:
                    timeRangeMin.length >= 5
                        ? new Date(timeRangeMin)
                        : undefined,
                to: timeRangeMax ? new Date(timeRangeMax) : undefined,
            }}
            onSelect={(value) => {
                if (value?.from && value?.to) {
                    setTimeRange(
                        value.from.toISOString(),
                        value.to.toISOString()
                    );
                }
            }}
        />
    </div>
);

const PresetTimeRangeSelector = ({
    selectedTimeRange,
    timeRanges,
    setTimeRange,
}: {
    selectedTimeRange: PresetTimeRange | undefined;
    timeRanges: PresetTimeRange[];
    setTimeRange: (
        timeRangeMin: string,
        timeRangeMax: string | undefined
    ) => void;
}): ReactElement => (
    <div className="flex flex-col gap-1.5">
        {timeRanges.map((timeRange: PresetTimeRange) => {
            const isSelected: boolean =
                selectedTimeRange?.min === timeRange.min;
            return (
                <Button
                    key={timeRange.name}
                    className={cn(
                        "w-32 justify-start text-sm text-white/75",
                        isSelected && "!bg-primary/60"
                    )}
                    variant="outline"
                    size="sm"
                    onClick={() => setTimeRange(timeRange.min, undefined)}
                >
                    {timeRange.name}
                </Button>
            );
        })}
    </div>
);

export default ChartTimeRangeSelector;
