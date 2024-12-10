import { relations } from "drizzle-orm/relations";
import { users, gameProgress, nftMetadata, playerActions } from "./schema";

export const gameProgressRelations = relations(gameProgress, ({one}) => ({
	user: one(users, {
		fields: [gameProgress.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	gameProgresses: many(gameProgress),
	nftMetadata: many(nftMetadata),
	playerActions_playerEmail: many(playerActions, {
		relationName: "playerActions_playerEmail_users_email"
	}),
	playerActions_playerId: many(playerActions, {
		relationName: "playerActions_playerId_users_gameshiftId"
	}),
	playerActions_playerWallet: many(playerActions, {
		relationName: "playerActions_playerWallet_users_walletAddress"
	}),
}));

export const nftMetadataRelations = relations(nftMetadata, ({one}) => ({
	user: one(users, {
		fields: [nftMetadata.userId],
		references: [users.id]
	}),
}));

export const playerActionsRelations = relations(playerActions, ({one}) => ({
	user_playerEmail: one(users, {
		fields: [playerActions.playerEmail],
		references: [users.email],
		relationName: "playerActions_playerEmail_users_email"
	}),
	user_playerId: one(users, {
		fields: [playerActions.playerId],
		references: [users.gameshiftId],
		relationName: "playerActions_playerId_users_gameshiftId"
	}),
	user_playerWallet: one(users, {
		fields: [playerActions.playerWallet],
		references: [users.walletAddress],
		relationName: "playerActions_playerWallet_users_walletAddress"
	}),
}));