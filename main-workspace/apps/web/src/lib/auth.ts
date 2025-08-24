"use server";

import { authClient } from "@/lib/auth-client";
import type { SessionResponse } from "@/types/auth";
import { cookies } from "next/headers";

/**
 * Get the current user session.
 *
 * @returns the current user session
 */
export const getSession = async (): Promise<SessionResponse | undefined> => {
    const { data } = await authClient.getSession({
        fetchOptions: {
            headers: {
                cookie: (await cookies()).toString(),
            },
        },
    });
    // No data in the response, return undefined
    if (!data) {
        return undefined;
    }
    // Return the session and user
    return {
        session: data.session,
        user: data.user,
    };
};
