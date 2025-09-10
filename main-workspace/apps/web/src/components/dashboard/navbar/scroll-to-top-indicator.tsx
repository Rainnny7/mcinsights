"use client";

import { ArrowUpIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactElement } from "react";
import SimpleTooltip from "../../simple-tooltip";
import { Button } from "../../ui/button";

const ScrollToTopIndicator = (): ReactElement => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.5 }}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
        >
            <SimpleTooltip content="Bring me to the top" side="bottom">
                <Button
                    className="size-7.5 border border-border rounded-full"
                    variant="ghost"
                    size="icon"
                    onClick={scrollToTop}
                >
                    <ArrowUpIcon className="size-4" />
                </Button>
            </SimpleTooltip>
        </motion.div>
    );
};
export default ScrollToTopIndicator;
