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
    // Create a custom axios instance for this specific request
    const customAxios = axios.create({
      baseURL: API_BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Add CORS configuration
      withCredentials: true
    });

    // Make the request with proper CORS handling
    const response = await customAxios.get('/api/users/login', {
      params: { email },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
    // If we get a CORS error, try with mode: 'no-cors'
    if (error.message.includes('CORS')) {
      console.log('⚠️ CORS error detected, retrying with no-cors mode');
      try {
        const response = await fetch(`${API_BACKEND_URL}/api/users/login?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        return data;
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        throw new Error("Login failed after CORS retry. Please try again.");
      }
    }
    throw new Error(error.response?.data?.message || "Login failed. Please try again.");
  }
};