import { api, API_BACKEND_URL } from '../api/apiConfig';

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
    // Use fetch API with no-cors mode as fallback
    const response = await fetch(`${API_BACKEND_URL}/api/users/login?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Login failed - server error');
    }

    const data = await response.json();
    console.log('✅ Login response:', data);

    if (!data.user || !data.token) {
      throw new Error("Invalid login response from server");
    }

    return data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.message || error);
    throw new Error(error.message || "Login failed. Please try again.");
  }
};