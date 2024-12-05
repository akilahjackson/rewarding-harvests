import { v4 as uuidv4 } from 'uuid';

const API_KEY = import.meta.env.VITE_GAMESHIFT_API_KEY; // Ensure this is properly set

const referenceID = `user_${uuidv4().replace(/-/g, '')}`;
console.log('Generated Reference ID:', referenceID);

interface GameShiftUser {
  referenceId: string;
  email: string;
}

export const registerGameShiftUser = async (
  email: string
): Promise<GameShiftUser> => {
  try {
    const endpoint = 'https://api.gameshift.dev/nx/users';
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    const userData: GameShiftUser = {
      referenceId: referenceID,
      email,
    };

    console.log('Request Payload:', userData);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData), // Ensure the body is properly serialized
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to register user with GameShift');
    }

    const data: GameShiftUser = await response.json();
    console.log('Registration Successful:', data);
    return data;
  } catch (error) {
    console.error('Registration Error:', error.message);
    throw error;
  }
};
