import { gameshiftApi } from '../api/apiConfig';

export interface GameShiftResponse {
  referenceId: string;
  email: string;
}

export const createUserInGameShift = async (email: string): Promise<GameShiftResponse> => {
  if (!email) {
    throw new Error("Email is required.");
  }

  console.log('🎮 Registering user in GameShift:', email);
  const referenceId = crypto.randomUUID();

  try {
    const response = await gameshiftApi.post('/', { referenceId, email });
    console.log('✅ GameShift registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ GameShift registration failed:', error.message || error);
    throw new Error("Failed to register user in GameShift.");
  }
};