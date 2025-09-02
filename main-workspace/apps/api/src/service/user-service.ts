import { user as userSchema } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { server } from "../db/schema/server";
import { auth } from "../lib/auth";
import type { Context } from "../lib/context";
import type { CompleteOnboardingBody } from "../types/body/complete-onboarding-body";
import type { ServerPlatform } from "../types/server";

export default class UserService {
    /**
     * Complete the onboarding process for a user.
     *
     * @param ctx the request context
     * @param input the input object
     */
    static completeOnboarding = async (
        ctx: Context,
        input: CompleteOnboardingBody
    ): Promise<void> => {
        const { user } = ctx.session;
        const { orgName, orgSlug, serverName, serverPlatform } = input;

        // Create the organization
        const organization = await auth.api.createOrganization({
            body: {
                name: orgName,
                slug: orgSlug,
                userId: user.id,
                keepCurrentActiveOrganization: false,
            },
            headers: {
                cookie: ctx.headers.get("cookie") || "",
            },
        });

        // We have data to create a server whilst onboarding, do so
        if (serverName && serverPlatform) {
            await db.insert(server).values({
                name: serverName,
                platform: serverPlatform as ServerPlatform,
                organizationId: organization.id,
            });
        }

        // Update the user to set the active organization and set onboarded as completed
        await db
            .update(userSchema)
            .set({
                onboarded: true,
            })
            .where(eq(userSchema.id, user.id));
    };
}
