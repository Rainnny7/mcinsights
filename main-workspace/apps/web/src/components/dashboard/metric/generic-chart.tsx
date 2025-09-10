"use client";

import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Clock, Loader2 } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ValueType } from "recharts/types/component/DefaultTooltipContent";
import { DATE_FORMATS, formatDate } from "../../../../../api/src/lib/date";
import { AnimateIcon } from "../../animate-ui/icons/icon";

export type GenericChartProps = {
    /**
     * The class name of the chart.
     */
    className?: string | undefined;

    /**
     * The icon of the chart.
     */
    icon?: ReactNode;

    /**
     * The title of the chart.
     */
    title: string;

    /**
     * The description of the chart.
     */
    description: string;

    /**
     * The fields to display on the chart.
     */
    fields: GenericChartField[];

    /**
     * Whether the data is loading.
     */
    isLoading?: boolean;

    /**
     * The data to display on the chart.
     */
    data: any[] | undefined;

    /**
     * The amount (in millis) of time to fetch the data.
     */
    responseTime: number;

    /**
     * The value formatter for the chart.
     */
    valueFormatter?: (value: ValueType) => string | ReactNode;
};

export type GenericChartField = {
    /**
     * The label of the field.
     */
    label: string;

    /**
     * The color of the field.
     */
    color: string;

    /**
     * The value of the field.
     */
    value: string;

    /**
     * Whether the field is togglable.
     */
    togglable?: boolean;
};

const GenericChart = ({
    className,
    icon,
    title,
    description,
    fields,
    isLoading,
    data,
    responseTime,
    valueFormatter,
}: GenericChartProps): ReactElement => (
    <AnimateIcon animateOnHover>
        <div
            className={cn(
                "p-4.5 flex flex-col gap-2 bg-muted/45 backdrop-blur-sm border border-muted-foreground/10 rounded-xl shadow-sm overflow-hidden",
                isLoading && "animate-pulse"
            )}
        >
            {/* Top Left Radial Gradient */}
            <div className="absolute -top-36 -left-36 w-[26rem] h-[20rem] bg-radial-[at_center] from-primary/80 via-transparent to-transparent blur-md rounded-full opacity-15 -z-10" />

            {/* Bottom Right Radial Gradient */}
            <div className="absolute -bottom-36 -right-36 w-[26rem] h-[20rem] bg-radial-[at_center] from-primary/80 via-transparent to-transparent blur-md rounded-full opacity-7 -z-10" />

            {/* Header */}
            <div className="relative flex gap-2.5 items-center">
                {/* Icon */}
                <div className="p-1.5 *:size-6 bg-muted-foreground/10 text-primary/70 border border-muted-foreground/10 rounded-lg">
                    {icon}
                </div>

                <div className="py-0.5 flex flex-col gap-0.5">
                    <h3 className="font-bold leading-none">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                {/* Loading & Response Time */}
                <div className="absolute top-0 right-0 flex gap-1 items-center text-sm text-muted-foreground/65">
                    {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                        <Clock className="size-3.5" />
                    )}
                    <span>
                        {isLoading ? "Loading data..." : `${responseTime}ms`}
                    </span>
                </div>
            </div>
            <Separator className="my-2.5 bg-muted-foreground/20" />

            {/* Chart */}
            <GenericAreaChart
                className={cn(className, isLoading && "opacity-50")}
                isLoading={isLoading}
                data={data}
                fields={fields}
                valueFormatter={valueFormatter}
            />
        </div>
    </AnimateIcon>
);

const GenericAreaChart = ({
    className,
    isLoading,
    data,
    fields,
    valueFormatter,
}: {
    className?: string | undefined;
    isLoading?: boolean;
    data: any[] | undefined;
    fields: GenericChartField[];
    valueFormatter?: (value: ValueType) => string | ReactNode;
}): ReactElement => {
    // Create the config for the chart based on the given fields
    const chartConfig: ChartConfig = fields.reduce(
        (acc, field) => ({
            ...acc,
            [field.value]: {
                label: field.label,
                color: field.color,
            },
        }),
        {}
    );

    // Build the chart to display
    const chart: ReactNode = (
        <ChartContainer
            config={chartConfig}
            className={cn("aspect-auto w-full h-[14rem]", className)}
        >
            <AreaChart data={data}>
                {/* Create a gradient effect for each field */}
                <defs>
                    {fields.map((field) => (
                        <linearGradient
                            key={field.value}
                            id={`fill${field.value}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={field.color}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={field.color}
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    ))}
                </defs>

                {/* Vertical Background Grid */}
                <CartesianGrid vertical={false} />

                {/* Axis */}
                <YAxis
                    width={32}
                    tickMargin={4}
                    minTickGap={32}
                    tickLine={false}
                    axisLine={false}
                />

                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value: string) =>
                        formatDate(new Date(value), "MMM DD")
                    }
                />

                {/* Tooltip */}
                <ChartTooltip
                    cursor
                    content={
                        <ChartTooltipContent
                            labelFormatter={(value) => {
                                return formatDate(
                                    new Date(value),
                                    DATE_FORMATS.DATE_TIME
                                );
                            }}
                            // valueFormatter={valueFormatter}
                            formatter={valueFormatter}
                            indicator="line"
                        />
                    }
                />

                {/* Draw each field as an area chart */}
                {fields.map((field: GenericChartField) => (
                    <Area
                        key={field.value}
                        dataKey={field.value}
                        type="natural"
                        fill={`url(#fill${field.value})`}
                        stroke={field.color}
                    />
                ))}

                {/* Legend */}
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    );

    return isLoading ? <div>{chart}</div> : chart;
};

export default GenericChart;
