import DashboardNavbar from "@/components/dashboard/navbar";
import { checkAndGetSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import ScaleInAnimation from "../../../components/animation/scale-in-animation";
import DiagonalLinesBackground from "../../../components/background/diagonal-lines-background";
import DashboardBreadcrumb from "../../../components/dashboard/breadcrumb";
import DashboardFooter from "../../../components/dashboard/footer";
import ScrollToTopIndicator from "../../../components/dashboard/navbar/scroll-to-top-indicator";
import { DashboardProvider } from "../../../provider/dashboard-provider";

const DashboardLayout = async ({
    children,
}: {
    children: ReactNode;
}): Promise<ReactElement> => {
    const { user } = await checkAndGetSession();
    if (!user.onboarded) {
        redirect("/onboarding");
    }
    return (
        <main
            className="relative"
            style={{
                background:
                    "linear-gradient(to top, var(--dashboard-alternative-background), var(--background))",
            }}
        >
            <DashboardProvider user={user}>
                <DiagonalLinesBackground>
                    <DashboardNavbar user={user} />
                    <div className="min-h-screen mx-auto max-w-screen-2xl px-5 pt-34 pb-10 space-y-5 z-10">
                        {/* Breadcrumb */}
                        <div className="w-fit">
                            <ScaleInAnimation>
                                <DashboardBreadcrumb />
                            </ScaleInAnimation>
                        </div>

                        {/* Content */}
                        {children}
                        <ScrollToTopIndicator />
                    </div>
                    <DashboardFooter />
                </DiagonalLinesBackground>
            </DashboardProvider>
        </main>
    );
};
export default DashboardLayout;
