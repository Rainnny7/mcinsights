"use client";

import { useScrolled } from "@/hooks/use-scrolled";
import type { ReactElement } from "react";

const DashboardNavbar = (): ReactElement => {
    const { scrolled } = useScrolled();
    return (
        <nav className="px-5 py-2.5 gap-4 bg-background border-b border-border">
            sadfsd
        </nav>
    );
};
export default DashboardNavbar;
