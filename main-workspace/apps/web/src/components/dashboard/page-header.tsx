import type { ReactElement, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AnimateIcon } from "../animate-ui/icons/icon";
import FadeInAnimation from "../animation/fade-in-animation";
import ScaleInAnimation from "../animation/scale-in-animation";
import { Separator } from "../ui/separator";

type DashboardPageHeaderProps = {
    className?: string | undefined;
    icon: ReactNode;
    title: string;
    description: string;
    withIconClasses?: boolean;
    children: ReactNode;
};

const DashboardPageHeader = ({
    className,
    icon,
    title,
    description,
    withIconClasses = true,
    children,
}: DashboardPageHeaderProps): ReactElement => (
    <main className="flex flex-col gap-4">
        {/* Header */}
        <div className="w-fit flex flex-col gap-2">
            <ScaleInAnimation delay={0.1}>
                <h1 className="flex gap-2.5 items-center text-3xl font-bold">
                    <AnimateIcon animateOnHover>
                        <span
                            className={cn(
                                withIconClasses &&
                                    "size-9 p-1.5 bg-muted text-primary/70 rounded-lg"
                            )}
                        >
                            {icon}
                        </span>
                    </AnimateIcon>
                    <span>{title}</span>
                </h1>
            </ScaleInAnimation>
            <ScaleInAnimation delay={0.2}>
                <p className="text-muted-foreground">{description}</p>
            </ScaleInAnimation>
        </div>
        <FadeInAnimation delay={0.4}>
            <Separator className="my-2" />
        </FadeInAnimation>

        {/* Content */}
        <FadeInAnimation
            className={cn("flex flex-col gap-5", className)}
            delay={0.6}
        >
            {children}
        </FadeInAnimation>
    </main>
);
export default DashboardPageHeader;
