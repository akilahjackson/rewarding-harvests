import axios from 'axios';
import { api } from '../api/apiConfig';

interface UserData {
  id: string;
  email: string;
  username?: string;
  gameshiftId?: string;
  walletAddress?: string;
  token?: string;
}

interface LoginResponse {
  user: {
    email: string;
    username?: string;
  };
  token: string;
}

export const loginUser = async (email: string): Promise<LoginResponse> => {
  console.log("🔵 userAuthService: Attempting login for email:", email);
  
  try {
    const response = await api.post<LoginResponse>(
      '/api/proxy/users/login',
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );

    console.log("✅ userAuthService: Login successful, response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ userAuthService: Login failed:", error);
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
};

export const saveUserToDatabase = async (userData: Partial<UserData>): Promise<{ user: UserData; token: string }> => {
  console.log("🔵 userAuthService: Saving user to database:", userData);
  
  try {
    const response = await api.post('/api/proxy/users', userData);
    console.log("✅ userAuthService: User saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ userAuthService: Failed to save user:", error);
    throw error;
  }
};

export const fetchUserFromDatabase = async (email: string): Promise<{ user: UserData; token: string }> => {
  console.log("🔵 userAuthService: Fetching user from database:", email);
  
  try {
    const response = await api.get(`/api/proxy/users/${email}`);
    console.log("✅ userAuthService: User fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ userAuthService: Failed to fetch user:", error);
    throw error;
  }
};