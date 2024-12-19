import axios from "axios";

export const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";
export const API_BACKEND_URL = "https://rewarding-harvests-xfkmy.ondigitalocean.app";
export const GAMESHIFT_API_KEY = import.meta.env.VITE_GAME_SHIFT_API_KEY;

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Add CORS configuration
  withCredentials: true
});

// Create GameShift specific axios instance
export const gameshiftApi = axios.create({
  baseURL: API_GAMESHIFT_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": GAMESHIFT_API_KEY
  }
});