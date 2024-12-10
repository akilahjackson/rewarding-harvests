-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"gameshift_id" varchar(100),
	"username" varchar(100),
	"email" varchar(255),
	"wallet_type" varchar(100),
	"wallet_address" varchar(255),
	"avatar_url" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_gameshift_id_key" UNIQUE("gameshift_id"),
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_wallet_address_key" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "game_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"completed_tasks" integer DEFAULT 0,
	"badges" jsonb DEFAULT '[]'::jsonb,
	"last_active" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nft_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"ownership" varchar(100),
	"nft_id" varchar(255),
	"squad" varchar(100),
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"metadata_uri" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "nft_metadata_nft_id_key" UNIQUE("nft_id")
);
--> statement-breakpoint
CREATE TABLE "player_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" varchar(100),
	"player_email" varchar(255),
	"player_wallet" varchar(255),
	"action_type" varchar(255) NOT NULL,
	"action_description" text,
	"action_timestamp" timestamp DEFAULT now(),
	"device" varchar(255) DEFAULT 'unknown'
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"nft_id" integer,
	"rank" integer,
	"xp" integer,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "game_progress" ADD CONSTRAINT "game_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_metadata" ADD CONSTRAINT "nft_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_email_fkey" FOREIGN KEY ("player_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."users"("gameshift_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_wallet_fkey" FOREIGN KEY ("player_wallet") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;
