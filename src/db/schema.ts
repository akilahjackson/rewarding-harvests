import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  text,
  timestamp,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  gameshiftId: varchar("gameshift_id", { length: 100 }).unique(),
  username: varchar("username", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  walletType: varchar("wallet_type", { length: 100 }),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  completedTasks: integer("completed_tasks").default(0),
  badges: jsonb("badges").default("[]"),
  lastActive: timestamp("last_active", { withTimezone: true }).defaultNow(),
});

export const nftMetadata = pgTable("nft_metadata", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id),
  ownership: varchar("ownership", { length: 100 }),
  nftId: varchar("nft_id", { length: 255 }).unique(),
  squad: varchar("squad", { length: 100 }),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  metadataUri: text("metadata_uri"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id),
  nftId: integer("nft_id")
    .references(() => nftMetadata.id),
  rank: integer("rank"),
  xp: integer("xp"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const playerActions = pgTable("player_actions", {
  id: serial("id").primaryKey(),
  playerId: varchar("player_id", { length: 100 })
    .references(() => users.gameshiftId),
  playerEmail: varchar("player_email", { length: 255 })
    .references(() => users.email),
  playerWallet: varchar("player_wallet", { length: 255 })
    .references(() => users.walletAddress),
  actionType: varchar("action_type", { length: 255 }).notNull(),
  actionDescription: text("action_description"),
  device: varchar("device", { length: 255 }).default("unknown"),
  actionTimestamp: timestamp("action_timestamp", { withTimezone: true }).defaultNow(),
});
