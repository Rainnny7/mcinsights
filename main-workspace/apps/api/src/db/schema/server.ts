import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { ServerPlatform } from "../../types/server";
import { organization } from "./auth";

export const server = pgTable("servers", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    platform: text("platform").notNull().$type<ServerPlatform>(),
    players: integer("players").notNull().default(0),
    maxPlayers: integer("max_players").notNull().default(0),
    lastHeartbeat: timestamp("last_heartbeat"),
    organizationId: text("organization_id")
        .notNull()
        .references(() => organization.id),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});
