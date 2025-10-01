"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Input } from "@/components/ui/input";

export function Password(
    props: React.ComponentProps<"input"> & { icon?: ReactNode }
) {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    return (
        <div className="*:not-first:mt-2">
            <div className="relative">
                <Input
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    icon={props.icon}
                    {...props}
                />
                <button
                    className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-all outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 duration-300 transform-gpu"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                >
                    {isVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                    ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
}
