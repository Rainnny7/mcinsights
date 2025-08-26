import Link from "next/link";
import type { ReactElement } from "react";
import FadeInAnimation from "./animation/fade-in-animation";
import SimpleTooltip from "./simple-tooltip";

const BasicFooter = (): ReactElement => (
    <FadeInAnimation
        className="fixed inset-x-0 bottom-7 text-center text-sm text-muted-foreground"
        direction="bottom"
        delay={1.25}
    >
        Made with <span className="animate-pulse">💚</span> by{" "}
        <SimpleTooltip content="View my website (:" side="top">
            <Link
                className="text-primary hover:opacity-75 transition-opacity duration-300 transform-gpu"
                href="https://rainnny.club"
                target="_blank"
                draggable={false}
            >
                Rainnny
            </Link>
        </SimpleTooltip>
    </FadeInAnimation>
);
export default BasicFooter;
