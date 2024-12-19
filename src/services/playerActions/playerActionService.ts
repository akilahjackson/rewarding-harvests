import { api } from '../api/apiConfig';

export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  actionType: string,
  actionDescription: string = "Login",
  device: string = "web"
) => {
  if (!playerId || !playerEmail || !actionType) {
    throw new Error("Missing required action parameters.");
  }

  try {
    const response = await api.post('/api/player-actions', {
      playerId,
      playerEmail,
      actionType,
      actionDescription,
      device,
    });

    console.log("✅ Player action logged successfully:", actionType, actionDescription);
    return response.data;
  } catch (error) {
    console.error("❌ Error logging player action:", error);
    throw error;
  }
};