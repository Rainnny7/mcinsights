import type { server } from "../db/schema/server";

export type ServerPlatform = "proxy" | "standalone";

export const SERVER_PLATFORMS: ServerPlatform[] = ["proxy", "standalone"];

export type MinecraftServer = typeof server.$inferSelect;
