import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ShimmerButtonProps = {
    children: ReactNode;
    className?: string;
};

const ShimmerButton = ({ children, className }: ShimmerButtonProps) => {
    return (
        <div
            className={cn(
                "relative group/shimmer flex items-center gap-3 justify-center overflow-hidden hover:shadow-xl duration-300 transform-gpu",
                className
            )}
        >
            <div className="h-[120px] w-10 bg-gradient-to-r from-white/10 via-white/30 to-white/10 absolute blur-sm -rotate-45 -left-16 group-hover/shimmer:left-[150%] duration-500 delay-200 z-10" />
            {children}
        </div>
    );
};
export default ShimmerButton;
