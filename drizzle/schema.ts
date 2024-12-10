import { pgTable, unique, serial, varchar, timestamp, foreignKey, integer, jsonb, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	gameshiftId: varchar("gameshift_id", { length: 100 }),
	username: varchar({ length: 100 }),
	email: varchar({ length: 255 }),
	walletType: varchar("wallet_type", { length: 100 }),
	walletAddress: varchar("wallet_address", { length: 255 }),
	avatarUrl: varchar("avatar_url", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_gameshift_id_key").on(table.gameshiftId),
	unique("users_email_key").on(table.email),
	unique("users_wallet_address_key").on(table.walletAddress),
]);

export const gameProgress = pgTable("game_progress", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	xp: integer().default(0),
	level: integer().default(1),
	completedTasks: integer("completed_tasks").default(0),
	badges: jsonb().default([]),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "game_progress_user_id_fkey"
		}),
]);

export const nftMetadata = pgTable("nft_metadata", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	ownership: varchar({ length: 100 }),
	nftId: varchar("nft_id", { length: 255 }),
	squad: varchar({ length: 100 }),
	xp: integer().default(0),
	level: integer().default(1),
	metadataUri: text("metadata_uri"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "nft_metadata_user_id_fkey"
		}),
	unique("nft_metadata_nft_id_key").on(table.nftId),
]);

export const playerActions = pgTable("player_actions", {
	id: serial().primaryKey().notNull(),
	playerId: varchar("player_id", { length: 100 }),
	playerEmail: varchar("player_email", { length: 255 }),
	playerWallet: varchar("player_wallet", { length: 255 }),
	actionType: varchar("action_type", { length: 255 }).notNull(),
	actionDescription: text("action_description"),
	actionTimestamp: timestamp("action_timestamp", { mode: 'string' }).defaultNow(),
	device: varchar({ length: 255 }).default('unknown'),
}, (table) => [
	foreignKey({
			columns: [table.playerEmail],
			foreignColumns: [users.email],
			name: "player_actions_player_email_fkey"
		}),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [users.gameshiftId],
			name: "player_actions_player_id_fkey"
		}),
	foreignKey({
			columns: [table.playerWallet],
			foreignColumns: [users.walletAddress],
			name: "player_actions_player_wallet_fkey"
		}),
]);

export const leaderboard = pgTable("leaderboard", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	nftId: integer("nft_id"),
	rank: integer(),
	xp: integer(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
