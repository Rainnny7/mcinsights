"use client";

import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";
import { motion } from "motion/react";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

const loadingMessages = [
    "Loading...",
    "Loading the dashboard...",
    "Loading the best experience...",
];

const DashboardLoadingOverlay = (): ReactElement => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(
        Math.floor(Math.random() * loadingMessages.length)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(
                (prevIndex) => (prevIndex + 1) % loadingMessages.length
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="absolute inset-0 min-h-screen flex justify-center items-center bg-background z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col gap-6 items-center animate-pulse">
                <Cardio
                    size="64"
                    stroke="4"
                    speed="2"
                    color="var(--color-primary)"
                />
                <span className="text-muted-foreground/75">
                    {loadingMessages[currentMessageIndex]}
                </span>
            </div>
        </motion.div>
    );
};

export default DashboardLoadingOverlay;
