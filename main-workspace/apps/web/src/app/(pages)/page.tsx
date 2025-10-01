import { Button } from "@/components/ui/button";
import { isCloud } from "@/lib/env";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

const LandingPage = (): ReactElement => {
    // Not the cloud version, always go to auth
    if (!isCloud) {
        redirect("/auth");
    }
    return (
        <main className="p-4 min-h-screen flex flex-col gap-4">
            <span>
                hi this is a landing page for the cloud ver, not done
                yet!!!!!1!!
            </span>

            <Link href="/auth">
                <Button>log me into this thing</Button>
            </Link>
        </main>
    );
};
export default LandingPage;
