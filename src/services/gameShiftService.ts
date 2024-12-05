import { v4 as uuidv4 } from 'uuid';

// API Key from environment variables
const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY; // Ensure this is set

// Generate a unique reference ID
const referenceID = `user_${uuidv4().replace(/-/g, '')}`;

interface GameShiftUser {
  referenceId: string;
  email: string;
}

export const registerGameShiftUser = async (email: string): Promise<any> => {
  try {
    const endpoint = 'https://api.gameshift.dev/nx/users';

    // Define headers
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': API_KEY, // Use x-api-key instead of Authorization
    };

    // Define payload
    const userData: GameShiftUser = {
      referenceId: referenceID,
      email,
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

    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to register user with GameShift');
    }

    const data = await response.json();
    console.log('GameShift Registration Successful:', data);
    return data;
  } catch (error) {
    console.error('Registration Error:', error.message);
    throw error;
  }
};
