// userService.js
import pool from './db.js';

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
    const actionQuery = `
      INSERT INTO player_actions (player_id, player_email, player_wallet, action_type, action_description, device)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const actionLog = await pool.query(actionQuery, [
      playerId,
      playerEmail,
      playerWallet,
      actionType,
      actionDescription,
      device,
    ]);

    console.log("✅ Action tracked:", actionLog.rows[0]);
    return actionLog.rows[0];
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
