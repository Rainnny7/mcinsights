ALTER TABLE "servers" ALTER COLUMN "last_heartbeat" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "players" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "max_players" integer DEFAULT 0 NOT NULL;