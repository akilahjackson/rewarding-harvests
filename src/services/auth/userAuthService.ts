import { api, API_BACKEND_URL } from '../api/apiConfig';
import axios from 'axios';

export interface BackendResponse {
  user: {
    id: string;
    email: string;
    username?: string;
  };
  token: string;
}

export const saveUserToDatabase = async (userData: { 
  email: string; 
  username?: string; 
}): Promise<BackendResponse> => {
  console.log('💾 Saving user to backend:', userData);
  
  try {
    const response = await api.post('/api/users/register', userData);
    console.log('✅ Backend registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Backend registration failed:', error.message || error);
    throw new Error("Failed to save user to backend.");
  }
};

export const fetchUserFromDatabase = async (email: string): Promise<BackendResponse> => {
  if (!email) {
    throw new Error("Email is required.");
  }

  console.log('🔍 Fetching user from backend:', email);

  try {
    // Use axios directly for login to handle CORS
    const response = await axios.get(`${API_BACKEND_URL}/api/users/login`, {
      params: { email },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Backend login response:', response.data);

    if (!response.data.user || !response.data.token) {
      throw new Error("Invalid login response from backend.");
    }

    // Store authentication data
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("gameshift_user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.message || error);
    throw new Error(error.response?.data?.message || "Login failed. Please try again.");
  }
};