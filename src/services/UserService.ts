// src/services/UserService.ts

import axios, { AxiosResponse } from "axios";

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
}

export interface PlayerActionResponse {
  success: boolean;
  message: string;
}

/**
 * Register user in GameShift
 * @param email - User email
 * @returns API Response
 */
export const createUserInGameShift = async (email: string): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.post("/api/gameshift/register", {
      email,
    });

    if (!response.data || !response.data.user || !response.data.user.id) {
      throw new Error("Failed to create user in GameShift.");
    }

    console.log("✅ GameShift Registration Successful:", response.data.user);
    return response.data;
  } catch (error: any) {
    console.error("❌ GameShift Registration Error:", error.message || error);
    throw new Error(error.response?.data?.message || "GameShift registration failed.");
  }
};

/**
 * Save user in the backend database
 * @param userData - User data payload
 * @returns API Response
 */
export const saveUserToDatabase = async (
  userData: Partial<UserResponse["user"]>
): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.post("/api/users/register", userData);

    if (!response.data || !response.data.user || !response.data.user.id) {
      throw new Error("Failed to save user to the backend.");
    }

    console.log("✅ Backend Registration Successful:", response.data.user);
    return response.data;
  } catch (error: any) {
    console.error("❌ Backend Registration Error:", error.message || error);
    throw new Error(error.response?.data?.message || "Backend registration failed.");
  }
};

/**
 * Fetch user from backend database
 * @param email - User email
 * @returns API Response
 */
export const fetchUserFromDatabase = async (email: string): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.get(
      `/api/users/login?email=${email}`
    );

    if (!response.data || !response.data.user || !response.data.token) {
      throw new Error("Invalid login response from the backend.");
    }

    console.log("✅ Login Successful:", response.data.user);
    return response.data;
  } catch (error: any) {
    console.error("❌ Login Error:", error.message || error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

/**
 * Log Player Action in the backend
 * @param playerId - User's GameShift ID
 * @param playerEmail - User's email
 * @param walletAddress - User's wallet address
 * @param actionType - Type of action (e.g., login)
 * @param actionDescription - Description of the action
 * @returns API Response
 */
export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  walletAddress: string,
  actionType: string,
  actionDescription: string
): Promise<PlayerActionResponse> => {
  try {
    const response: AxiosResponse<PlayerActionResponse> = await axios.post("/api/player-actions", {
      playerId,
      playerEmail,
      playerWallet: walletAddress,
      actionType,
      actionDescription,
    });

    if (!response.data || !response.data.success) {
      throw new Error("Failed to log player action.");
    }

    console.log("✅ Player Action Logged:", actionType, actionDescription);
    return response.data;
  } catch (error: any) {
    console.error("❌ Player Action Logging Error:", error.message || error);
    throw new Error(error.response?.data?.message || "Player action logging failed.");
  }
};
