"use client";

import AppLogo from "@/components/app-logo";
import OrganizationSwitcher from "@/components/dashboard/navbar/organization-switcher";
import { Separator } from "@/components/ui/separator";
import { SlashIcon } from "lucide-react";
import type { ReactElement } from "react";

const DashboardNavbar = (): ReactElement => {
    return (
        <nav className="fixed inset-x-0 top-0 px-4 py-1.5 gap-4 bg-muted/50 border-b border-border">
            <div className="mx-auto max-w-screen-3xl">
                {/* Top */}
                <div className="flex justify-between gap-3.5 items-center">
                    {/* Left */}
                    <div className="flex gap-3 items-center">
                        <AppLogo size={36} />
                        <SlashIcon className="size-4 text-muted-foreground" />
                        <OrganizationSwitcher />
                    </div>
                    sdfsd
                </div>

                <Separator className="my-1.5" />

                {/* Bottom */}
                <div>sdfds</div>
            </div>
        </nav>
    );
};
export default DashboardNavbar;
