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
    const response = await fetch(`${API_BACKEND_URL}/api/player-actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        playerId,
        playerEmail,
        actionType,
        actionDescription,
        device
      })
    });

    if (!response.ok) {
      throw new Error('Failed to log player action');
    }

    console.log('✅ Player action logged successfully');
    return await response.json();
  } catch (error) {
    console.error('❌ Error logging player action:', error);
    throw error;
  }
};