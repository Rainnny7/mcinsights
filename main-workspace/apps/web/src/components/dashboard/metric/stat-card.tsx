"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InfoIcon, Loader2Icon } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";
import CountUp from "react-countup";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";
import { useDashboard } from "../../../provider/dashboard-provider";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import SimpleTooltip from "../../simple-tooltip";
import { Skeleton } from "../../ui/skeleton";

type StatCardProps = {
    title: string;
    icon: ReactNode;
    description: string;
    metric: string;
    footer?: ReactNode | undefined;
};

const StatCard = ({
    title,
    icon,
    description,
    metric,
    footer,
}: StatCardProps): ReactElement => {
    const { activeOrganization, timeRangeMin, timeRangeMax } = useDashboard();
    const { isLoading, data } = trpc.metrics.queryMetrics.useQuery(
        {
            organizationId: activeOrganization?.id!,
            metric,
            timeRangeMin,
            timeRangeMax,
        },
        {
            enabled: !!activeOrganization?.id,
        }
    );
    const value: number = data?.metrics[data.latestDataPoint ?? ""]?.value ?? 0;

    return (
        <SimpleTooltip content={description}>
            <div className="relative">
                <AnimateIcon animateOnHover>
                    <Card
                        className={cn(
                            "relative w-full px-0.5 gap-2.5 hover:opacity-90 transition-all duration-300 ease-in-out transform-gpu overflow-hidden",
                            isLoading && "animate-pulse"
                        )}
                    >
                        {/* Bottom Gradient */}
                        <div className="absolute inset-x-0 -bottom-10 w-full h-16 bg-radial-[at_center] from-primary/80 to-transparent blur-md rounded-full opacity-10 -z-10" />

                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground font-medium">
                                {title}
                                <InfoIcon className="size-3" />

                                {/* Loading */}
                                {isLoading && (
                                    <Loader2Icon className="ml-auto size-4 animate-spin" />
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            {/* Value */}
                            <div className="text-3xl font-bold">
                                {isLoading ? (
                                    <Skeleton className="w-18 h-10" />
                                ) : (
                                    <CountUp end={value} />
                                )}
                            </div>

                            {/* Icon */}
                            <div className="p-1.5 *:size-6 bg-muted-foreground/10 text-primary/70 border border-muted-foreground/10 rounded-lg">
                                {icon}
                            </div>
                        </CardContent>
                        {footer && <CardFooter>{footer}</CardFooter>}
                    </Card>
                </AnimateIcon>
            </div>
        </SimpleTooltip>
    );
};
export default StatCard;
