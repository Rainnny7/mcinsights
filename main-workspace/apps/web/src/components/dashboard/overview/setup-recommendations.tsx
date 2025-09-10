"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactElement } from "react";
import { toast } from "sonner";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import { XIcon } from "../../animate-ui/icons/x";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const recommendations: string[] = [
    "Et in amet consectetur ea anim cillum exercitation.",
    "Qui eu elit non ex ipsum est aliqua reprehenderit.",
];

const SetupRecommendations = (): ReactElement => {
    const [hideRecommendations, setHideRecommendations] =
        useState<boolean>(false);

    useEffect(() => {
        const hideRecommendations = localStorage.getItem(
            "hide-recommendations"
        );
        if (hideRecommendations) {
            setHideRecommendations(true);
        }
    }, []);

    const dismissRecommendations = () => {
        setHideRecommendations(true);
        localStorage.setItem("hide-recommendations", "true");
        toast.success("Got it, recommendations dismissed");
    };

    return (
        <AnimatePresence>
            {!hideRecommendations && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    <Alert className="relative gap-3">
                        <AlertTitle className="flex items-center gap-2 text-lg">
                            <InfoIcon className="p-1 size-7 bg-muted-foreground/10 text-primary/70 rounded-lg" />
                            <span>Setup Recommendations</span>
                        </AlertTitle>
                        <AlertDescription className="flex flex-col gap-2">
                            {recommendations.map(
                                (recommendation: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2"
                                    >
                                        <span>{recommendation}</span>
                                        {index < recommendations.length - 1 && (
                                            <Separator />
                                        )}
                                    </div>
                                )
                            )}
                        </AlertDescription>

                        {/* Dismiss Button */}
                        <SimpleTooltip
                            content="I don't want to see this anymore"
                            side="bottom"
                        >
                            <div className="absolute top-3 right-3">
                                <AnimateIcon animateOnHover>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={dismissRecommendations}
                                    >
                                        <XIcon className="size-4" />
                                        Dismiss
                                    </Button>
                                </AnimateIcon>
                            </div>
                        </SimpleTooltip>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default SetupRecommendations;
