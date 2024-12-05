import { v4 as uuidv4 } from 'uuid';

const GAMESHIFT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIzMjkxZGYyMy0zODY1LTQwNjEtYTcxZS1kOGIzZGE1ZGYyNTgiLCJzdWIiOiIxNjI3MWQ0Mi1kMDdjLTRmNTgtOTQ2MC05Nzg4MTY3NjkxNjEiLCJpYXQiOjE3MzMzNzQxMTV9.HjZ5MPjypiPSoyGqxrw22IPYsgssRTGPWW4M_DBzWxw';

interface GameShiftUser {
  referenceId: string;
  email: string;
  externalWalletAddress?: string;
}

interface GameShiftUserResponse extends GameShiftUser {
  address?: string;
}

export const registerGameShiftUser = async (
  email: string, 
  externalWalletAddress?: string
): Promise<GameShiftUserResponse> => {
  try {
    console.log('Registering user with GameShift:', { email, externalWalletAddress });
    
    const userData: GameShiftUser = {
      referenceId: `user_${uuidv4().replace(/-/g, '')}`,
      email,
      ...(externalWalletAddress && { externalWalletAddress })
    };

    const response = await fetch('https://api.gameshift.dev/nx/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GAMESHIFT_API_KEY}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user with GameShift');
    }

    const data = await response.json();
    console.log('GameShift registration successful:', data);
    return data;
  } catch (error) {
    console.error('GameShift registration error:', error);
    throw error;
  }
};

export const fetchUserItems = async (userId: string) => {
  try {
    console.log('Fetching user items from GameShift:', userId);
    
    const response = await fetch(
      `https://api.gameshift.dev/nx/users/${userId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${GAMESHIFT_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user items');
    }

    const data = await response.json();
    console.log('User items fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user items:', error);
    throw error;
  }
};