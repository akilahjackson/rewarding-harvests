import { v4 as uuidv4 } from 'uuid';

// API Key from environment variables
const API_KEY = process.env.GAMESHIFT_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ GameShift API key not found. Some features may not work properly.");
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
    throw new Error("GameShift API key is not configured. Please check your environment variables.");
  }

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

    console.log('🔵 GameShift: Sending registration request:', {
      endpoint,
      headers: { ...headers, 'x-api-key': '[REDACTED]' },
      body: userData,
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    // Handle existing user case
    if (response.status === 409) {
      console.log('⚠️ GameShift: User already exists:', data);
      throw new Error('An account with this email already exists. Please try logging in instead.');
    }

    if (!response.ok) {
      console.error('❌ GameShift: Error Response:', data);
      throw new Error(data.message || 'Failed to register user with GameShift');
    }

    console.log('✅ GameShift: Registration Successful:', data);
    return data;
  } catch (error: any) {
    console.error('❌ GameShift: Registration Error:', error.message);
    throw error;
  }
};

// Fetch wallet balances using GameShift API
export const fetchWalletBalances = async (walletAddress: string) => {
  if (!API_KEY) {
    throw new Error("GameShift API key is not configured. Please check your environment variables.");
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