import { isCloud } from "@/lib/env";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "./auth-client";

export const logoutUser = async () => {
    await authClient.signOut();
    toast.success("Logged out, goodbye!");
    redirect(isCloud ? "/" : "/auth");
};
