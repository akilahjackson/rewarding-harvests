import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.GAMESHIFT_API_KEY;
if (!API_KEY) {
  console.warn('⚠️ GameShift: API key not found in environment variables');
}

// Generate a unique reference ID
const referenceID = `user_${uuidv4().replace(/-/g, '')}`;

interface GameShiftUserData {
  email: string;
  externalWallet?: string;
  referenceId: string;
}

export const registerGameShiftUser = async (email: string, externalWallet?: string): Promise<any> => {
  if (!API_KEY) {
    throw new Error('GameShift API key not found');
  }

  console.log('🎮 GameShift: Attempting registration...');

  try {
    const endpoint = 'https://api.gameshift.dev/nx/users';

    const headers = {
      'accept': 'application/json',
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    };

    const userData: GameShiftUserData = {
      email,
      referenceId: referenceID,
      ...(externalWallet && { externalWallet })
    };

    console.log('📤 GameShift: Sending registration request with data:', {
      ...userData,
      externalWallet: userData.externalWallet ? '[REDACTED]' : undefined
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ GameShift: Server responded with error:', data);
      throw new Error(data.message || 'Failed to register user with GameShift');
    }

    console.log('✅ GameShift: Registration Successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ GameShift: Registration Error:', error.message);
    throw error;
  }
};

export const getWalletBalances = async () => {
  if (!API_KEY) {
    throw new Error('GameShift API key not found');
  }

  const response = await fetch(`https://api.gameshift.dev/nx/users/${referenceID}/wallet-address`, {
    headers: {
      'accept': 'application/json',
      'x-api-key': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wallet balances');
  }

  return await response.json();
};