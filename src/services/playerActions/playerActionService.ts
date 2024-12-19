import { api } from '../api/apiConfig';

export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  actionType: string,
  actionDescription = "N/A",
  device = "web"
) => {
  console.log('📝 Logging player action:', actionType);

  try {
    const token = localStorage.getItem('auth_token');
    const response = await api.post('/api/player-actions', 
      {
        playerId,
        playerEmail,
        actionType,
        actionDescription,
        device,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Player action logged:', response.data);
  } catch (error: any) {
    console.error('❌ Failed to log player action:', error.message || error);
    throw new Error("Failed to log player action.");
  }
};