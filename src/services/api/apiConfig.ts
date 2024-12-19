import axios from "axios";

export const API_BACKEND_URL = "https://rewarding-harvests-xfkmy.ondigitalocean.app";
export const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";

// Create axios instance with base configuration
export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

// Create GameShift specific axios instance
export const gameshiftApi = axios.create({
  baseURL: API_GAMESHIFT_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("🔵 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);