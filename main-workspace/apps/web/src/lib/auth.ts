"use server";

import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";

/**
 * Get the current user session.
 *
 * @returns the current user session
 */
export const getSession = async (): Promise<any | null> => {
    return await authClient.getSession({
        fetchOptions: {
            headers: {
                cookie: (await cookies()).toString(),
            },
        },
    });
};
