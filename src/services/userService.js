// userService.js
import { db } from './data/index.ts' // Drizzle database instance
import { playerActions } from './data/schema.ts'; // Drizzle schema for player_actions

/**
 * Tracks Player Action in the Database
 */
export async function trackUserAction(
  playerId,
  playerEmail,
  playerWallet,
  actionType,
  actionDescription = "",
  device = "unknown"
) {
  try {
    // Insert action into player_actions table using Drizzle ORM
    const [actionLog] = await db.insert(playerActions).values({
      playerId,
      playerEmail,
      playerWallet,
      actionType,
      actionDescription,
      device,
    }).returning();

    console.log("✅ Action tracked:", actionLog);
    return actionLog;
  } catch (error) {
    console.error("❌ Tracking Error:", error.message || error);
    throw error;
  }
}

// Track Game Start
export async function startHarvest(player, device = "unknown") {
  return await trackUserAction(
    player.gameshift_id,
    player.email,
    player.wallet_address,
    "START_HARVEST",
    "Player started the Harvest game.",
    device
  );
}

// Track New Wager
export async function placeBet(player, wagerAmount, device = "unknown") {
  return await trackUserAction(
    player.gameshift_id,
    player.email,
    player.wallet_address,
    "NEW_WAGER",
    `Player placed a wager of ${wagerAmount} HRVST.`,
    device
  );
}

// Track Game Results
export async function recordGameResults(player, resultMessage, device = "unknown") {
  return await trackUserAction(
    player.gameshift_id,
    player.email,
    player.wallet_address,
    "GAME_RESULTS",
    resultMessage,
    device
  );
}
