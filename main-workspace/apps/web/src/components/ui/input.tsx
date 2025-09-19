import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
    className,
    type,
    placeholderPrefix,
    ...props
}: React.ComponentProps<"input"> & { placeholderPrefix?: string }) {
    return (
        <div className="flex items-center">
            {placeholderPrefix && (
                <span className="px-2 py-1 h-9 flex justify-center items-center bg-input/30 text-sm text-muted-foreground/85 border border-input rounded-l-md">
                    {placeholderPrefix}
                </span>
            )}

            <input
                type={type}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    placeholderPrefix && "pl-2 rounded-l-none",
                    className
                )}
                {...props}
            />
        </div>
    );
}

export { Input };
