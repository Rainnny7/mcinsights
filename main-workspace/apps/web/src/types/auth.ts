import type { User as BetterAuthUser, Session } from "better-auth";

export type SessionResponse = {
    session: Session;
    user: User;
};

export type User = BetterAuthUser & {
    onboarded: boolean;
    role: string;
};
