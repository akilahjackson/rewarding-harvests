import { api } from '../api/apiConfig';

export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  actionType: string,
  actionDescription = "N/A",
  device = "unknown"
): Promise<void> => {
  if (!playerId || !playerEmail || !actionType) {
    throw new Error("Missing required action parameters.");
  }

  console.log('📝 Logging player action:', actionType);

  try {
    const response = await api.post('/api/player-actions', {
      playerId,
      playerEmail,
      actionType,
      actionDescription,
      device,
    });

    console.log('✅ Player action logged:', response.data);
  } catch (error: any) {
    console.error('❌ Failed to log player action:', error.message || error);
    throw new Error("Failed to log player action.");
  }
};