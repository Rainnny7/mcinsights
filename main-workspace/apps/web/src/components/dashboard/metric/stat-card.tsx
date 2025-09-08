import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { SlidingNumber } from "../../animate-ui/primitives/texts/sliding-number";
import SimpleTooltip from "../../simple-tooltip";

type StatCardProps = {
    title: string;
    icon: ReactNode;
    description: string;
    value: number;
    footer?: ReactNode | undefined;
};

const StatCard = ({
    title,
    icon,
    description,
    value,
    footer,
}: StatCardProps): ReactElement => {
    return (
        <SimpleTooltip content={description}>
            <div>
                <AnimateIcon animateOnHover>
                    <Card className="relative w-49 px-0.5 py-2.5 gap-2.5 bg-muted/45 backdrop-blur-sm hover:opacity-90 transition-all duration-300 ease-in-out transform-gpu overflow-hidden">
                        {/* Bottom Gradient */}
                        <div className="absolute inset-x-0 -bottom-10 w-full h-16 bg-radial-[at_center] from-primary/80 to-transparent blur-md rounded-full opacity-10 -z-10" />

                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground font-medium">
                                {title}
                                <InfoIcon className="size-3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            {/* Value */}
                            <div className="text-3xl font-bold">
                                <SlidingNumber
                                    number={value}
                                    fromNumber={0}
                                    padStart
                                />
                            </div>

                            {/* Icon */}
                            <div className="*:size-9 text-muted-foreground">
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
