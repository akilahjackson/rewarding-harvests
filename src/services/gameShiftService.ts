import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY; // For Vite
const referenceID = Math.random().toString(36).substr(2, 9);
console.log(referenceID);



interface GameShiftUser {
  referenceId: string;
  email: string;
  externalWalletAddress?: string;
}

interface GameShiftUserResponse extends GameShiftUser {
  address?: string;
}

export const registerGameShiftUser = async (email, externalWallet) => {
  const endpoint = 'https://api.gameshift.com/register';
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const body = {
    referenceID,
    email,
    wallet: externalWallet || null,
  };

  const response = await axios.post(endpoint, body, { headers });
  return response.data;
};

/* export const registerGameShiftUser = async (
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
}; */

export const fetchUserItems = async (userId: string) => {
  try {
    console.log('Fetching user items from GameShift:', userId);
    
    const response = await fetch(
      `https://api.gameshift.dev/nx/users/${userId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
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
