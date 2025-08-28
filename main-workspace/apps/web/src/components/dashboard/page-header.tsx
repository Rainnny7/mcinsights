import type { LucideIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import FadeInAnimation from "../animation/fade-in-animation";
import { Separator } from "../ui/separator";

type DashboardPageHeaderProps = {
    icon: LucideIcon | string;
    title: string;
    description: string;
    children: ReactNode;
};

const DashboardPageHeader = ({
    icon: Icon,
    title,
    description,
    children,
}: DashboardPageHeaderProps): ReactElement => (
    <main className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
            <FadeInAnimation>
                <h1 className="flex gap-2.5 items-center text-3xl font-bold">
                    <Icon className="size-9 p-1.5 bg-muted text-muted-foreground rounded-lg" />
                    <span>{title}</span>
                </h1>
            </FadeInAnimation>
            <FadeInAnimation delay={0.2}>
                <p className="text-muted-foreground">{description}</p>
            </FadeInAnimation>
        </div>
        <FadeInAnimation delay={0.4}>
            <Separator className="my-2" />
        </FadeInAnimation>

        {/* Content */}
        <FadeInAnimation delay={0.5}>{children}</FadeInAnimation>
    </main>
);
export default DashboardPageHeader;
