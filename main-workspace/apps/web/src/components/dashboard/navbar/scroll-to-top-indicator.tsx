"use client";

import { ArrowUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactElement } from "react";
import { useScrolled } from "../../../hooks/use-scrolled";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const ScrollToTopIndicator = (): ReactElement => {
    const { scrolled } = useScrolled();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.div
                    className="fixed bottom-12 right-8 z-10"
                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.5 }}
                    transition={{
                        duration: 0.35,
                        ease: "easeInOut",
                    }}
                >
                    <SimpleTooltip content="Bring me to the top" side="left">
                        <Button
                            className="size-7.5 bg-black/15 backdrop-blur-sm border border-border rounded-full"
                            variant="ghost"
                            size="icon"
                            onClick={scrollToTop}
                        >
                            <ArrowUpIcon className="size-4.5 text-muted-foreground" />
                        </Button>
                    </SimpleTooltip>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default ScrollToTopIndicator;
