// API Configuration
const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const GAMESHIFT_API_KEY = import.meta.env.VITE_GAME_SHIFT_API_KEY;

/**
 * Centralized API Request Handler
 * Automatically injects JWT token if present in localStorage.
 */
export const apiRequest = async (method, url, payload = {}) => {
  const token = localStorage.getItem("auth_token");

  const options = {
    method,
    headers: {
      "content-type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Attach JWT Token
    },
    ...(method !== "GET" && { body: JSON.stringify(payload) }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ API Request Failed: ${url} | ${errorMessage}`);
      throw new Error(`Request Error: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Network/API Error in ${url}:`, error.message || error);
    throw error;
  }
};

/**
 * Register User in GameShift
 * Registers a new user using `referenceId` and `email`.
 */
export const createUserInGameShift = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const referenceId = crypto.randomUUID();  // Unique GameShift ID

  const url = API_GAMESHIFT_URL;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-api-key": GAMESHIFT_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      referenceId,
      email,
    }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ GameShift Registration Error: ${response.status} - ${errorMessage}`);
      throw new Error(`GameShift Registration Error: ${errorMessage}`);
    }

    const userData = await response.json();
    console.log("✅ User successfully registered in GameShift:", userData);

    return { referenceId, email, ...userData };
  } catch (error) {
    console.error("❌ Error registering user in GameShift:", error.message || error);
    throw new Error("Failed to register user in GameShift.");
  }
};

/**
 * Save User to Backend Database
 * Saves the user in the backend database using the schema.
 */
export const saveUserToDatabase = async (userData) => {
  const url = `${API_BACKEND_URL}/api/users/register`;

  const payload = {
    gameshiftId: userData.referenceId,  // Ensure correct field mapping
    email: userData.email,
    username: userData.username || "unknown",
  };

  return await apiRequest("POST", url, payload);
};

/**
 * Fetch User from Backend Database
 * Retrieves the user from the backend using the provided email.
 */
export const fetchUserFromDatabase = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const url = `${API_BACKEND_URL}/api/auth/login`;
  const payload = { email };

  const { user, token } = await apiRequest("POST", url, payload);
  localStorage.setItem("auth_token", token);  // Save JWT Token

  console.log("✅ User fetched from backend:", user);
  return user;
};

/**
 * Log Player Action
 * Logs a player's action using the correct schema from the database.
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

  const payload = {
    playerId,
    playerEmail,
    playerWallet: playerWallet || "unknown",
    actionType,
    actionDescription,
    device,
  };

  const url = `${API_BACKEND_URL}/api/player-actions`;
  await apiRequest("POST", url, payload);

  console.log("✅ Player action logged successfully:", actionType, actionDescription);
};

/**
 * Logout User
 * Clears user data and JWT token from local storage.
 */
export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("gameshift_user");
  console.log("✅ User logged out successfully.");
};
