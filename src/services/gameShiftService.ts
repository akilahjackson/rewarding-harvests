import { v4 as uuidv4 } from 'uuid';

// API Key from environment variables
const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY;

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

    // Define headers
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': API_KEY,
    };

    // Define payload
    const userData: GameShiftUser = {
      referenceId: referenceID,
      email,
      ...(externalWallet && { externalWallet })
    };

    console.log('Sending Request:', {
      endpoint,
      headers,
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