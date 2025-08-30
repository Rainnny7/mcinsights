import DashboardNavbar from "@/components/dashboard/navbar";
import { checkAndGetSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
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
            className="min-h-screen"
            style={{
                background:
                    "linear-gradient(to top, var(--dashboard-alternative-background), var(--background))",
            }}
        >
            <DashboardProvider user={user}>
                <DashboardNavbar user={user} />
                <div className="mx-auto max-w-screen-xl px-5 pt-36 pb-5">
                    {children}
                </div>
            </DashboardProvider>
        </main>
    );
};
export default DashboardLayout;
