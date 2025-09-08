"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo, type ReactElement, type ReactNode } from "react";
import { env } from "../../lib/env";
import { useDashboard } from "../../provider/dashboard-provider";
import { ChevronUpDownIcon } from "../animate-ui/icons/chevron-up-down";
import { Button } from "../ui/button";
import OrganizationSwitcher from "./navbar/organization-switcher";

type BreadcrumbSegment = {
    label: string;
    href: string;
    isLast: boolean;
};

const DashboardBreadcrumb = (): ReactElement => {
    const path: string = usePathname();
    const { activeOrganization } = useDashboard();

    const breadcrumbs: BreadcrumbSegment[] = useMemo(() => {
        const segments = path.split("/").slice(1);
        return segments.map((segment, index) => ({
            label:
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " "),
            href: `/${segments.slice(0, index + 1).join("/")}`,
            isLast: index === segments.length - 1,
        }));
    }, [path]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map(
                    (breadcrumb: BreadcrumbSegment, index: number) => {
                        const item: ReactNode = (
                            <BreadcrumbItem className="h-9">
                                {breadcrumb.isLast ? (
                                    <BreadcrumbPage>
                                        {breadcrumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={`${env.NEXT_PUBLIC_BASE_URL}/${breadcrumb.href}`}
                                            draggable={false}
                                        >
                                            {breadcrumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        );
                        return (
                            <Fragment key={index}>
                                {item}
                                {index === 1 && activeOrganization && (
                                    <OrganizationSwitcher>
                                        <Button
                                            className="w-5.5"
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <ChevronUpDownIcon />
                                        </Button>
                                    </OrganizationSwitcher>
                                )}
                                {(index === 0 || !breadcrumb.isLast) && (
                                    <BreadcrumbSeparator>
                                        <span className="text-2xl text-muted-foreground/35">
                                            /
                                        </span>
                                    </BreadcrumbSeparator>
                                )}
                            </Fragment>
                        );
                    }
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
export default DashboardBreadcrumb;
