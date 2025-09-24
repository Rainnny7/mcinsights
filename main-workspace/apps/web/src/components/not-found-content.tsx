"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { ArrowLeftIcon } from "../components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "../components/animate-ui/icons/icon";
import { SearchIcon } from "../components/animate-ui/icons/search";
import ScaleInAnimation from "../components/animation/scale-in-animation";
import Background from "../components/background";
import { Button } from "../components/ui/button";
import BasicFooter from "../components/basic-footer";

const NotFoundContent = (): ReactElement => {
    const router: AppRouterInstance = useRouter();
    const path: string = usePathname();
    return (
        <main className="min-h-screen flex justify-center items-center">
            <Background />
            <ScaleInAnimation delay={0.6}>
                <div className="relative flex flex-col gap-7 items-center z-10">
                    {/* Icon */}
                    <div className="p-3.5 bg-muted-foreground/10 backdrop-blur-sm text-primary/70 rounded-xl">
                        <AnimateIcon animateOnHover>
                            <SearchIcon className="size-10" />
                        </AnimateIcon>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2.5 text-center items-center">
                        <h1 className="text-4xl text-primary/85 font-bold">
                            Not Found
                        </h1>
                        <p className="text-muted-foreground">
                            The page{" "}
                            <code className="text-primary/90">{path}</code> does
                            not exist.
                        </p>
                    </div>

                    {/* Actions */}
                    <AnimateIcon animateOnHover>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.back()}
                        >
                            <ArrowLeftIcon className="size-4" />
                            Previous Page
                        </Button>
                    </AnimateIcon>
                </div>
            </ScaleInAnimation>
            <BasicFooter />
        </main>
    );
};
export default NotFoundContent;
