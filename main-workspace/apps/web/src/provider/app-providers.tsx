"use client";

import { queryClient, trpc, trpcClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

const AppProviders = ({ children }: { children: ReactNode }) => {
    // Disable the default context menu
    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (!target.closest("[data-custom-context-menu]")) {
                event.preventDefault();
            }
        };
        document.addEventListener("contextmenu", handleContextMenu);
        return () =>
            document.removeEventListener("contextmenu", handleContextMenu);
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    {children}
                </trpc.Provider>
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    classNames: {
                        toast: "!flex !items-center !gap-2 !bg-popover/50 !backdrop-blur-sm !border !border-border !rounded-xl",
                        success: "!text-green-500",
                        error: "!text-red-500",
                        content: "!text-white/95",
                    },
                }}
            />
        </ThemeProvider>
    );
};
export default AppProviders;
