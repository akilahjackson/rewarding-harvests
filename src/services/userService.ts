import axios from "axios";

// API Configuration
const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";
const API_BACKEND_URL = "https://rewarding-harvests-xfkmy.ondigitalocean.app/";
const GAMESHIFT_API_KEY = import.meta.env.VITE_GAME_SHIFT_API_KEY;

// Create a Centralized Axios Instance
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios Request Interceptor - Attach JWT Token if Available
 */
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.url);
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Axios Response Interceptor - Handle Common Response Cases
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

interface GameShiftResponse {
  referenceId: string;
  email: string;
}

interface BackendResponse {
  user: {
    id: string;
    email: string;
    username?: string;
  };
  token: string;
}

/**
 * Register User in GameShift API
 */
export const createUserInGameShift = async (email: string): Promise<GameShiftResponse> => {
  if (!email) {
    throw new Error("Email is required.");
  }

  console.log('🎮 Registering user in GameShift:', email);
  const referenceId = crypto.randomUUID();

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

    console.log('✅ GameShift registration successful:', userData);
    return { referenceId, email, ...userData };
  } catch (error: any) {
    console.error('❌ GameShift registration failed:', error.message || error);
    throw new Error("Failed to register user in GameShift.");
  }
};

/**
 * Save User to Backend Database
 */
export const saveUserToDatabase = async (userData: { 
  gameshiftId: string; 
  email: string; 
  username?: string; 
}): Promise<BackendResponse> => {
  console.log('💾 Saving user to backend:', userData);
  
  try {
    const response = await api.post(`${API_BACKEND_URL}/api/users/register`, userData);
    console.log('✅ User saved to backend:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to save user to backend:', error.message || error);
    throw new Error("Failed to save user to backend.");
  }
};

/**
 * Fetch User from Backend Database
 */
export const fetchUserFromDatabase = async (email: string): Promise<BackendResponse> => {
  if (!email) {
    throw new Error("Email is required.");
  }

  console.log('🔍 Fetching user from backend:', email);

  try {
    const response = await api.get(`${API_BACKEND_URL}/api/users/login`, { 
      params: { email } 
    });

    const { user, token } = response.data;

    if (!user || !token) {
      throw new Error("Invalid login response from backend.");
    }

    // Save JWT Token and User to LocalStorage
    localStorage.setItem("auth_token", token);
    localStorage.setItem("gameshift_user", JSON.stringify(user));

    console.log('✅ User fetched successfully:', user);
    return { user, token };
  } catch (error: any) {
    console.error('❌ Login failed:', error.message || error);
    throw new Error("Login failed.");
  }
};

/**
 * Log Player Action
 */
export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  playerWallet: string | undefined,
  actionType: string,
  actionDescription = "N/A",
  device = "unknown"
): Promise<void> => {
  if (!playerId || !playerEmail || !actionType) {
    throw new Error("Missing required action parameters.");
  }

  console.log('📝 Logging player action:', actionType);

  try {
    await api.post(`${API_BACKEND_URL}/api/player-actions`, {
      playerId,
      playerEmail,
      playerWallet: playerWallet || "unknown",
      actionType,
      actionDescription,
      device,
    });

    console.log('✅ Player action logged successfully');
  } catch (error: any) {
    console.error('❌ Failed to log player action:', error.message || error);
    throw new Error("Failed to log player action.");
  }
};

/**
 * Logout User
 */
export const logoutUser = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("gameshift_user");
  console.log('👋 User logged out successfully');
};