import axios from "axios";

export const API_BACKEND_URL = "https://rewarding-harvests-xfkmy.ondigitalocean.app";
export const API_GAMESHIFT_URL = "https://api.gameshift.dev/nx/users";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Create GameShift specific axios instance
export const gameshiftApi = axios.create({
  baseURL: API_GAMESHIFT_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});