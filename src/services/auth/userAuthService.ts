import { API_BACKEND_URL } from '../api/apiConfig';

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
    const response = await fetch(`${API_BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    console.log('✅ Backend registration response:', data);
    return data;
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
    const response = await fetch(`${API_BACKEND_URL}/api/users/login?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
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