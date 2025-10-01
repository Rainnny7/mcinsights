"use client";

import { ArrowLeftIcon } from "@/components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import FadeInAnimation from "@/components/animation/fade-in-animation";
import AppLogo from "@/components/app-logo";
import LoginForm from "@/components/auth/login-form";
import Background from "@/components/background";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { isCloud } from "@/lib/env";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import ScaleInAnimation from "../../../components/animation/scale-in-animation";
import BasicFooter from "../../../components/basic-footer";

const LoginPage = (): ReactElement => {
    const router: AppRouterInstance = useRouter();
    return (
        <div className="relative px-5 min-h-screen flex justify-center items-center">
            <Background />

            {/* Back Button */}
            {isCloud && (
                <div className="absolute top-5 left-1 xs:left-5 transition-all duration-300 ease-in-out transform-gpu">
                    <FadeInAnimation direction="left" delay={0.6}>
                        <SimpleTooltip
                            content="Go back a previous page"
                            side="right"
                        >
                            <div>
                                <AnimateIcon animateOnHover>
                                    <Button
                                        className="text-muted-foreground"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.back()}
                                    >
                                        <ArrowLeftIcon className="size-4" />
                                        <span>Go Back</span>
                                    </Button>
                                </AnimateIcon>
                            </div>
                        </SimpleTooltip>
                    </FadeInAnimation>
                </div>
            )}

            <ScaleInAnimation
                className="relative w-full max-w-62 flex flex-col gap-7 justify-center items-center z-10"
                delay={0.6}
            >
                {/* Branding */}
                <div className="flex gap-2 items-center">
                    <AppLogo size={64} />
                    <div className="relative">
                        <span className="text-3xl font-minecraft">
                            MCInsights
                        </span>
                        <span className="absolute -bottom-5 right-0 text-primary font-semibold">
                            BETA
                        </span>
                    </div>
                </div>

                {/* Form */}
                <LoginForm />
            </ScaleInAnimation>
            <BasicFooter />
        </div>
    );
};
export default LoginPage;
