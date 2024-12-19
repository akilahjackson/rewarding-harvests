import axios from "axios";

// Define API Response Interfaces
export interface UserResponse {
  user: {
    id: string;
    email: string;
    username: string;
    gameshiftId: string;
    walletAddress?: string;
    avatarUrl?: string;
  };
  token: string;
  referenceId?: string;
}

/**
 * Register user in GameShift
 */
export const createUserInGameShift = async (email: string): Promise<UserResponse> => {
  try {
    const response = await axios.post("/api/gameshift/register", { email });
    console.log("✅ GameShift Registration Successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ GameShift Registration Error:", error);
    throw new Error(error.response?.data?.message || "GameShift registration failed.");
  }
};

/**
 * Save user in the backend database
 */
export const saveUserToDatabase = async (userData: Partial<UserResponse["user"]>): Promise<UserResponse> => {
  try {
    const response = await axios.post("/api/users/register", userData);
    console.log("✅ Backend Registration Successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Backend Registration Error:", error);
    throw new Error(error.response?.data?.message || "Backend registration failed.");
  }
};

/**
 * Fetch user from backend database
 */
export const fetchUserFromDatabase = async (email: string): Promise<UserResponse> => {
  try {
    const response = await axios.get(`/api/users/login?email=${email}`);
    console.log("✅ Login Successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

/**
 * Log Player Action
 */
export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  walletAddress: string,
  actionType: string,
  actionDescription: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post("/api/player-actions", {
      playerId,
      playerEmail,
      playerWallet: walletAddress,
      actionType,
      actionDescription,
    });
    console.log("✅ Player Action Logged:", actionType);
    return response.data;
  } catch (error: any) {
    console.error("❌ Player Action Error:", error);
    throw new Error(error.response?.data?.message || "Failed to log player action.");
  }
};