import type { Session, User } from "better-auth";

export type SessionResponse = {
    session: Session;
    user: User;
};
