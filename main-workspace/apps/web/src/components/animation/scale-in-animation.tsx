"use client";

import { motion } from "motion/react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ScaleInAnimationProps = {
    className?: string;
    delay?: number;
    initialScale?: number;
    viewport?: boolean;
    viewportOnce?: boolean;
    viewportMargin?: string;
    children: ReactNode;
};

const ScaleInAnimation = ({
    className,
    delay = 0,
    initialScale = 0.8,
    viewport = false,
    viewportOnce = true,
    viewportMargin = "-100px",
    children,
}: ScaleInAnimationProps): ReactElement => (
    <motion.div
        className={cn(className)}
        initial={{ opacity: 0, scale: initialScale }}
        animate={viewport ? undefined : { opacity: 1, scale: 1 }}
        whileInView={viewport ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.35, delay }}
        viewport={
            viewport
                ? { once: viewportOnce, margin: viewportMargin }
                : undefined
        }
    >
        {children}
    </motion.div>
);

export default ScaleInAnimation;
