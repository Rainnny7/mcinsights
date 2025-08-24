"use client";

import { motion } from "motion/react";
import type { ReactElement } from "react";

const Background = (): ReactElement => (
    <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{
            background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 170, 0, 0.25), transparent 70%), #000000",
        }}
    />
);
export default Background;
