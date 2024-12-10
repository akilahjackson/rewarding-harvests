import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  gameshiftId: varchar("gameshift_id", { length: 100 }).unique("users_gameshift_id_unique"),
  username: varchar("username", { length: 100 }),
  email: varchar("email", { length: 255 }).unique("users_email_unique"),
  walletType: varchar("wallet_type", { length: 100 }),
  walletAddress: varchar("wallet_address", { length: 255 }).unique("users_wallet_address_unique"),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { name: "game_progress_user_id_users_id_fk" }),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  completedTasks: integer("completed_tasks").default(0),
  badges: jsonb("badges").default("[]"),
  lastActive: timestamp("last_active", { withTimezone: true }).defaultNow(),
});

export const nftMetadata = pgTable("nft_metadata", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { name: "nft_metadata_user_id_users_id_fk" }),
  ownership: varchar("ownership", { length: 100 }),
  nftId: varchar("nft_id", { length: 255 }).unique("nft_metadata_nft_id_unique"),
  squad: varchar("squad", { length: 100 }),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  metadataUri: text("metadata_uri"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { name: "leaderboard_user_id_users_id_fk" }),
  nftId: integer("nft_id")
    .references(() => nftMetadata.id, { name: "leaderboard_nft_id_nft_metadata_id_fk" }),
  rank: integer("rank"),
  xp: integer("xp"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const playerActions = pgTable("player_actions", {
  id: serial("id").primaryKey(),
  playerId: varchar("player_id", { length: 100 })
    .references(() => users.gameshiftId, { name: "player_actions_player_id_users_gameshift_id_fk" }),
  playerEmail: varchar("player_email", { length: 255 })
    .references(() => users.email, { name: "player_actions_player_email_users_email_fk" }),
  playerWallet: varchar("player_wallet", { length: 255 })
    .references(() => users.walletAddress, { name: "player_actions_player_wallet_users_wallet_address_fk" }),
  actionType: varchar("action_type", { length: 255 }).notNull(),
  actionDescription: text("action_description"),
  device: varchar("device", { length: 255 }).default("unknown"),
  actionTimestamp: timestamp("action_timestamp", { withTimezone: true }).defaultNow(),
});
