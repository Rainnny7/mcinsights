"use client";

import { motion } from "motion/react";
import type { ReactElement } from "react";

const Background = (): ReactElement => (
    <motion.div
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        // style={{
        //     background:
        //         "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 170, 0, 0.25), transparent 70%), var(--dashboard-alternative-background)",
        // }}
        style={{
            background:
                "radial-gradient(circle at 20% 20%, var(--dashboard-alternative-background) 0%, transparent 40%), radial-gradient(circle at 80% 30%, var(--dashboard-alternative-background) 0%, transparent 40%), linear-gradient(120deg, #0f170e 0%, var(--dashboard-alternative-background) 100%)",
        }}
    />
);
export default Background;
