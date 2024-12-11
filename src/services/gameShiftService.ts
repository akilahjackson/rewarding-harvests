import { v4 as uuidv4 } from 'uuid';

// API Key - we'll store this in localStorage for now since we don't have a backend
const getApiKey = () => {
  const storedKey = localStorage.getItem('gameshift_api_key');
  if (!storedKey) {
    // For development, you can set a default key here
    const defaultKey = "your_default_key_here"; // Replace with your GameShift API key
    localStorage.setItem('gameshift_api_key', defaultKey);
    return defaultKey;
  }
  return storedKey;
};

// Generate a unique reference ID
const referenceID = `user_${uuidv4().replace(/-/g, '')}`;

interface GameShiftUser {
  referenceId: string;
  email: string;
  externalWallet?: string;
}

export const registerGameShiftUser = async (email: string, externalWallet?: string): Promise<any> => {
  try {
    const endpoint = 'https://api.gameshift.dev/nx/users';
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error('GameShift API key is not configured');
    }

    // Define headers with API key
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    };

    // Define payload
    const userData: GameShiftUser = {
      referenceId: referenceID,
      email,
      ...(externalWallet && { externalWallet })
    };

    console.log('Sending Request:', {
      endpoint,
      headers: {
        ...headers,
        'x-api-key': '[REDACTED]' // Don't log the actual API key
      },
      body: userData,
    });

    // Make the POST request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Handle existing user case
    if (response.status === 409) {
      console.log('User already exists:', data);
      throw new Error('An account with this email already exists. Please try logging in instead.');
    }

    if (!response.ok) {
      console.error('Error Response:', data);
      throw new Error(data.message || 'Failed to register user with GameShift');
    }

    console.log('GameShift Registration Successful:', data);
    return data;
  } catch (error) {
    console.error('Registration Error:', error.message);
    throw error;
  }
};

// Fetch wallet balances using GameShift API
export const fetchWalletBalances = async (walletAddress: string) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('GameShift API key is not configured');
  }

  const response = await fetch(`https://api.gameshift.dev/nx/users/${referenceID}/wallet-address`, {
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'referenceId': referenceID
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wallet balances.");
  }

  const data = await response.json();

  return {
    usdc: data.usdc || 0,
    sol: data.sol || 0,
    hrvst: data.hrvst || 0,
  };
};