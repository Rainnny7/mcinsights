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
import { Fragment, useMemo, type ReactElement } from "react";
import { env } from "../../lib/env";

type BreadcrumbSegment = {
    label: string;
    href: string;
    isLast: boolean;
};

const DashboardBreadcrumb = (): ReactElement => {
    const path: string = usePathname();

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
                    (breadcrumb: BreadcrumbSegment, index: number) => (
                        <Fragment key={index}>
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
                            {(index === 0 || !breadcrumb.isLast) && (
                                <BreadcrumbSeparator>
                                    <span className="text-2xl text-muted-foreground/35">
                                        /
                                    </span>
                                </BreadcrumbSeparator>
                            )}
                        </Fragment>
                    )
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
export default DashboardBreadcrumb;
