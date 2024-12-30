import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

// Environment Variables
const API_URL = process.env["API_URL"] || "";
const GAMESHIFT_API_URL_USERS = process.env["GAMESHIFT_API_URL_USERS"] || "";
const GAMESHIFT_API_KEY = process.env["GAMESHIFT_API_KEY"] || "";

if (!API_URL) {
  console.warn("⚠️ Backend API URL is not defined in environment variables.");
}
if (!GAMESHIFT_API_URL_USERS) {
  console.warn("⚠️ GameShift API URL for users is not defined in environment variables.");
}
if (!GAMESHIFT_API_KEY) {
  console.warn("⚠️ GameShift API Key is not defined in environment variables.");
}

// Axios Instances
const gameShiftApi = axios.create({
  baseURL: GAMESHIFT_API_URL_USERS,
  headers: {
    accept: "application/json",
    "x-api-key": GAMESHIFT_API_KEY,
    "Content-Type": "application/json",
  },
});

const gamingBackendApi = axios.create({
  baseURL: API_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Register GameShift User
 * @param email - User's email
 * @param externalWallet - Optional external wallet address
 * @returns API Response
 */
export const registerGameShiftUser = async (email: string, externalWallet?: string): Promise<AxiosResponse> => {
  try {
    const referenceID = `user_${Math.random().toString(36).substring(2, 15)}`;
    const userData = {
      email,
      referenceId: referenceID,
      ...(externalWallet && { externalWallet }),
    };

    console.log("📤 GameShift: Registering user:", userData);

    const response = await gameShiftApi.post("/users", userData);

    console.log("✅ GameShift: User registration successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ GameShift: Error registering user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to register GameShift user.");
  }
};/**
 * Fetch Wallet Balances using GameShift ID
 * @param gameshiftId - User's GameShift reference ID
 * @returns Wallet balances for the user
 */
export const fetchUserWalletBalances = async (gameshiftId: string): Promise<any> => {
  try {
    console.log(`📤 Fetching wallet balances for GameShift ID: ${gameshiftId}`);

    // Construct the API URL with the corrected query parameters
    const url = `${GAMESHIFT_API_URL_USERS}/${gameshiftId}/items?types=&types=Currency%20&types=UniqueAsset&types=StackableAsset`;

    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-api-key": GAMESHIFT_API_KEY,
      },
    });

    if (!response.data) {
      throw new Error("No data in response");
    }

    console.log("✅ Wallet balances fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching wallet balances:", error.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch wallet balances.");
  }
};

/**
 * Fetch User Wallet
 * @param playerId - User's GameShift reference ID
 * @returns Wallet items
 */
export const fetchUserWallet = async (playerId: string): Promise<any> => {
  try {
    console.log(`📤 Fetching wallet items for player ID: ${playerId}`);
    const url = `${GAMESHIFT_API_URL_USERS}/${playerId}/items?types=Currency&types=UniqueAsset&types=StackableAsset`;

    const response = await gameShiftApi.get(url);

    console.log("✅ Wallet items fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching wallet items:", error.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch user wallet items.");
  }
};

/**
 * Log Player Action
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
): Promise<any> => {
  try {
    const device = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

    console.log("🛠️ Logging Player Action:");
    console.log("➡️ playerId:", playerId);
    console.log("➡️ playerEmail:", playerEmail);
    console.log("➡️ walletAddress:", walletAddress);
    console.log("➡️ actionType:", actionType);
    console.log("➡️ actionDescription:", actionDescription);
    console.log("➡️ device:", device);

    const response = await gamingBackendApi.post("/player-actions", {
      playerId,
      playerEmail,
      playerWallet: walletAddress,
      actionType,
      actionDescription,
      device,
    });

    console.log("✅ Player Action Logged Successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error Logging Player Action:", error.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || "Player action logging failed.");
  }
};

/**
 * Refresh Wallet Balances
 * @param playerId - User's GameShift reference ID
 * Updates game store with wallet balances
 */
export const refreshWalletBalances = async (playerId: string): Promise<void> => {
  try {
    const walletData = await fetchUserWallet(playerId);
    const balances = {
      SOL: "0",
      USDC: "0",
      HRVST: "0",
    };

    walletData.data.forEach((item: any) => {
      if (item.type === "Currency") {
        const { id, quantity } = item.item;
        if (balances[id] !== undefined) {
          balances[id] = quantity || "0";
        }
      }
    });

    console.log("✅ Updated Wallet Balances:", balances);
    gameStore.setWalletBalances(balances);
  } catch (error: any) {
    console.error("❌ Error refreshing wallet balances:", error.message || error);
  }
};
