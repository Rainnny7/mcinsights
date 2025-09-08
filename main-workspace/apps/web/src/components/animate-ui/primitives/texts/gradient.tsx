"use client";

import { motion, type Transition } from "motion/react";
import * as React from "react";

type GradientTextProps = Omit<React.ComponentProps<"span">, "children"> & {
    text: string;
    gradient?: string;
    neon?: boolean;
    transition?: Transition;
};

function GradientText({
    text,
    style,
    gradient = "linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-foreground) 20%, var(--color-primary) 50%, var(--color-primary-foreground) 80%, var(--color-primary) 100%)",
    neon = false,
    transition = { duration: 50, repeat: Infinity, ease: "linear" },
    ...props
}: GradientTextProps) {
    const baseStyle: React.CSSProperties = {
        backgroundImage: gradient,
        margin: 0,
        color: "transparent",
        backgroundClip: "text",
        backgroundSize: "700% 100%",
        backgroundPosition: "0% 0%",
    };

    return (
        <span
            data-slot="gradient-text"
            style={{ position: "relative", display: "inline-block", ...style }}
            {...props}
        >
            <motion.span
                style={baseStyle}
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: "500% 100%" }}
                transition={transition}
            >
                {text}
            </motion.span>

            {neon && (
                <motion.span
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        mixBlendMode: "plus-lighter",
                        filter: "blur(8px)",
                        ...baseStyle,
                    }}
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "500% 100%" }}
                    transition={transition}
                >
                    {text}
                </motion.span>
            )}
        </span>
    );
}

export { GradientText, type GradientTextProps };
