import axios from "axios";

// API Configuration
const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://rewarding-harvests-xfkmy.ondigitalocean.app/";
const GAMESHIFT_API_KEY = import.meta.env.VITE_GAME_SHIFT_API_KEY;

// Create a Centralized Axios Instance
const api = axios.create({
 // baseURL: API_GAMESHIFT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios Request Interceptor - Attach JWT Token if Available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Register User in GameShift API
 */
export const createUserInGameShift = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const referenceId = crypto.randomUUID(); // Generate Unique Reference ID

  try {
    const response = await axios.post(
      API_GAMESHIFT_URL,
      { referenceId, email },
      {
        headers: {
          accept: "application/json",
          "x-api-key": GAMESHIFT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const userData = response.data;
    if (!userData.referenceId || !userData.email) {
      throw new Error("Invalid registration response from GameShift.");
    }

    console.log("✅ User successfully registered in GameShift:", userData);
    return { referenceId, email, ...userData };
  } catch (error) {
    console.error("❌ Error registering user in GameShift:", error.message || error);
    throw new Error("Failed to register user in GameShift.");
  }
};

/**
 * Save User to Backend Database
 */
export const saveUserToDatabase = async (userData) => {
  try {
    const response = await api.post("/api/users/register", {
      gameshiftId: userData.referenceId,
      email: userData.email,
      username: userData.username || "unknown",
    });

    console.log("✅ User saved to backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error saving user to backend:", error.message || error);
    throw new Error("Failed to save user to backend.");
  }
};

/**
 * Fetch User from Backend Database
 */
export const fetchUserFromDatabase = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  try {
    const response = await api.get("/api/users/login", { email });

    const { user, token } = response.data;

    if (!user || !token) {
      throw new Error("Invalid login response from backend.");
    }

    // Save JWT Token and User to LocalStorage
    localStorage.setItem("auth_token", token);
    localStorage.setItem("gameshift_user", JSON.stringify(user));

    console.log("✅ User fetched from backend:", user);
    return user;
  } catch (error) {
    console.error("❌ Login failed:", error.message || error);
    throw new Error("Login failed.");
  }
};

/**
 * Log Player Action
 */
export const addPlayerAction = async (
  playerId,
  playerEmail,
  playerWallet,
  actionType,
  actionDescription = "N/A",
  device = "unknown"
) => {
  if (!playerId || !playerEmail || !actionType) {
    throw new Error("Missing required action parameters.");
  }

  try {
    const response = await api.post("/api/player-actions", {
      playerId,
      playerEmail,
      playerWallet: playerWallet || "unknown",
      actionType,
      actionDescription,
      device,
    });

    console.log("✅ Player action logged successfully:", actionType, actionDescription);
    return response.data;
  } catch (error) {
    console.error("❌ Error logging player action:", error.message || error);
    throw new Error("Failed to log player action.");
  }
};

/**
 * Logout User
 */
export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("gameshift_user");
  console.log("✅ User logged out successfully.");
};
