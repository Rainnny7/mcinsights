import DashboardNavbar from "@/components/dashboard/navbar";
import { checkAndGetSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
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
                <div className="min-h-screen mx-auto max-w-screen-xl px-5 pt-36 pb-5">
                    {children}
                </div>
                <DashboardFooter />
            </DashboardProvider>
        </main>
    );
};
export default DashboardLayout;
