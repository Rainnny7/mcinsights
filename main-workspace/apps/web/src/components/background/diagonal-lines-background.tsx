import type { ReactElement, ReactNode } from "react";
import { patterns } from "../../lib/patterns";

type DiagonalLinesBackgroundProps = {
    children: ReactNode;
};

const DiagonalLinesBackground = ({
    children,
}: DiagonalLinesBackgroundProps): ReactElement => (
    <div
        className="-z-10"
        style={{
            backgroundImage: patterns.diagonallines
                .replace("{{color}}", "white")
                .replace("{{opacity}}", "0.07"),
        }}
    >
        {children}
    </div>
);
export default DiagonalLinesBackground;
