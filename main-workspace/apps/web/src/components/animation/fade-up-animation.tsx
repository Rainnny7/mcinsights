"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactElement, ReactNode } from "react";

type FadeUpAnimationProps = {
    className?: string;
    delay?: number;
    children: ReactNode;
};

const FadeUpAnimation = ({
    className,
    delay = 0,
    children,
}: FadeUpAnimationProps): ReactElement => (
    <motion.div
        className={cn(className)}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay, ease: "easeInOut" }}
    >
        {children}
    </motion.div>
);
export default FadeUpAnimation;
