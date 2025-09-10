import DashboardNavbar from "@/components/dashboard/navbar";
import { checkAndGetSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import FadeInAnimation from "../../../components/animation/fade-in-animation";
import DashboardBreadcrumb from "../../../components/dashboard/breadcrumb";
import DashboardFooter from "../../../components/dashboard/footer";
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
            style={{
                background:
                    "linear-gradient(to top, var(--dashboard-alternative-background), var(--background))",
            }}
        >
            <DashboardProvider user={user}>
                <DashboardNavbar user={user} />
                <div className="min-h-screen mx-auto max-w-screen-xl px-5 pt-34 pb-10 space-y-5">
                    <FadeInAnimation delay={0}>
                        <DashboardBreadcrumb />
                    </FadeInAnimation>
                    {children}
                </div>
                <DashboardFooter />
            </DashboardProvider>
        </main>
    );
};
export default DashboardLayout;
