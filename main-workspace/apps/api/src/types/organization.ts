import type { organization } from "../db/schema/auth";

export type Organization = typeof organization.$inferSelect;
