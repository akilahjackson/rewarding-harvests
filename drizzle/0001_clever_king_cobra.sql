/*ALTER TABLE "users" DROP CONSTRAINT "users_gameshift_id_key";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_wallet_address_key";--> statement-breakpoint
ALTER TABLE "nft_metadata" DROP CONSTRAINT "nft_metadata_nft_id_key";--> statement-breakpoint
ALTER TABLE "game_progress" DROP CONSTRAINT "game_progress_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "nft_metadata" DROP CONSTRAINT "nft_metadata_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "player_actions" DROP CONSTRAINT "player_actions_player_email_fkey";
--> statement-breakpoint
ALTER TABLE "player_actions" DROP CONSTRAINT "player_actions_player_id_fkey";
--> statement-breakpoint
ALTER TABLE "player_actions" DROP CONSTRAINT "player_actions_player_wallet_fkey";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "game_progress" ALTER COLUMN "badges" SET DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "game_progress" ALTER COLUMN "last_active" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "nft_metadata" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "player_actions" ALTER COLUMN "action_timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "game_progress" ADD CONSTRAINT "game_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_metadata" ADD CONSTRAINT "nft_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_id_users_gameshift_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("gameshift_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_email_users_email_fk" FOREIGN KEY ("player_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_actions" ADD CONSTRAINT "player_actions_player_wallet_users_wallet_address_fk" FOREIGN KEY ("player_wallet") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_nft_id_nft_metadata_id_fk" FOREIGN KEY ("nft_id") REFERENCES "public"."nft_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_gameshift_id_unique" UNIQUE("gameshift_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address");--> statement-breakpoint
ALTER TABLE "nft_metadata" ADD CONSTRAINT "nft_metadata_nft_id_unique" UNIQUE("nft_id");*/