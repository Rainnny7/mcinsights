import * as React from "react";

import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { CommandShortcut } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function Input({
    className,
    type,
    placeholderPrefix,
    icon,
    keyboardShortcut,
    ...props
}: React.ComponentProps<"input"> & {
    placeholderPrefix?: string;
    icon?: ReactNode;
    keyboardShortcut?: string;
}) {
    return (
        <AnimateIcon animateOnHover>
            <div className="relative flex items-center">
                {placeholderPrefix && (
                    <span className="px-2 py-1 h-9 flex justify-center items-center bg-input/30 text-sm text-muted-foreground/85 border border-input rounded-l-lg">
                        {placeholderPrefix}
                    </span>
                )}

                {icon && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 *:size-4 text-muted-foreground">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    data-slot="input"
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        placeholderPrefix && "pl-2 rounded-l-none",
                        icon && "pl-7.5",
                        keyboardShortcut && "pr-7",
                        className
                    )}
                    {...props}
                />

                {keyboardShortcut && (
                    <CommandShortcut className="absolute right-2 top-1/2 -translate-y-1/2">
                        {keyboardShortcut}
                    </CommandShortcut>
                )}
            </div>
        </AnimateIcon>
    );
}

export { Input };
