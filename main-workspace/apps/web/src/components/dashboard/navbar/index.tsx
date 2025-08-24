"use client";

import AppLogo from "@/components/app-logo";
import { Separator } from "@/components/ui/separator";
import { SlashIcon } from "lucide-react";
import type { ReactElement } from "react";

const DashboardNavbar = (): ReactElement => {
    return (
        <nav className="fixed inset-x-0 top-0 px-5 py-1 gap-4 bg-muted/50 border-b border-border">
            {/* Top */}
            <div className="flex gap-3 items-center">
                <AppLogo size={36} />
                <SlashIcon className="size-4 text-muted-foreground" />
            </div>
            <Separator className="my-1.5" />

            {/* Bottom */}
            <div>sdfds</div>
        </nav>
    );
};
export default DashboardNavbar;
