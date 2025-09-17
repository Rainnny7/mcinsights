import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AnimateIcon } from "../animate-ui/icons/icon";

type SettingsGroupProps = {
    icon: ReactNode;
    title: string;
    variant?: "default" | "destructive";
    children: ReactNode;
};

const SettingsGroup = ({
    icon,
    title,
    variant = "default",
    children,
}: SettingsGroupProps): ReactElement => (
    <AnimateIcon animateOnHover>
        <Card className="py-0 gap-0">
            <CardHeader
                className={cn(
                    "!py-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border rounded-t-xl rounded-b-lg",
                    variant === "destructive" &&
                        "from-destructive/10 via-destructive/5"
                )}
            >
                <CardTitle>
                    <span className="*:size-5">{icon}</span>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="py-3">{children}</CardContent>
        </Card>
    </AnimateIcon>
);
export default SettingsGroup;
