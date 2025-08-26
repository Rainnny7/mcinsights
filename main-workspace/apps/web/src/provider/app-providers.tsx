"use client";

import { queryClient, trpc, trpcClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

const AppProviders = ({ children }: { children: ReactNode }) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </trpc.Provider>
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
        <Toaster richColors />
    </ThemeProvider>
);
export default AppProviders;
