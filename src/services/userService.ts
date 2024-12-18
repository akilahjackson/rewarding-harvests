import axios from "axios";

// API Configuration
const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";
const API_BACKEND_URL = "https://rewarding-harvests-xfkmy.ondigitalocean.app";
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
    console.log('✅ API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.config?.url, error.response?.status, error.response?.data);
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

    console.log('✅ GameShift registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ GameShift registration failed:', error.message || error);
    throw new Error("Failed to register user in GameShift.");
  }
};

/**
 * Save User to Backend Database
 */
export const saveUserToDatabase = async (userData: { 
  email: string; 
  username?: string; 
}): Promise<BackendResponse> => {
  console.log('💾 Saving user to backend:', userData);
  
  try {
    const response = await api.post(`${API_BACKEND_URL}/api/users/register`, userData);
    console.log('✅ Backend registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Backend registration failed:', error.message || error);
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
    // Changed to GET request with query parameters
    const response = await api.get(`${API_BACKEND_URL}/api/users/login`, { 
      params: { email } 
    });

    console.log('✅ Backend login response:', response.data);

    if (!response.data.user || !response.data.token) {
      throw new Error("Invalid login response from backend.");
    }

    // Save JWT Token and User to LocalStorage
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("gameshift_user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.message || error);
    throw new Error(error.response?.data?.message || "Login failed. Please try again.");
  }
};

/**
 * Log Player Action
 */
export const addPlayerAction = async (
  playerId: string,
  playerEmail: string,
  actionType: string,
  actionDescription = "N/A",
  device = "unknown"
): Promise<void> => {
  if (!playerId || !playerEmail || !actionType) {
    throw new Error("Missing required action parameters.");
  }

  console.log('📝 Logging player action:', actionType);

  try {
    const response = await api.post(`${API_BACKEND_URL}/api/player-actions`, {
      playerId,
      playerEmail,
      actionType,
      actionDescription,
      device,
    });

    console.log('✅ Player action logged:', response.data);
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