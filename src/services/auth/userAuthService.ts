import { API_BACKEND_URL } from '../api/apiConfig';

interface UserData {
  id: string;
  email: string;
  username?: string;
  gameshiftId?: string;
  walletAddress?: string;
  token?: string;
}

export const loginUser = async (email: string): Promise<any> => {
  console.log("🔵 userAuthService: Attempting login with email:", email);
  
  try {
    // Use relative URL to avoid CORS issues
    const response = await fetch('/api/proxy/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error("❌ userAuthService: Server responded with error:", response.status);
      throw new Error('Login failed - server error');
    }

    const data = await response.json();
    console.log("✅ userAuthService: Login successful, received data:", data);
    return data;
  } catch (error) {
    console.error("❌ userAuthService: Login failed:", error);
    throw error;
  }
};

export const saveUserToDatabase = async (userData: Partial<UserData>): Promise<{ user: UserData; token: string }> => {
  console.log("🔵 userAuthService: Saving user to database:", userData);
  
  try {
    const response = await fetch('/api/proxy/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to save user to database');
    }

    const data = await response.json();
    console.log("✅ userAuthService: User saved successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ userAuthService: Failed to save user:", error);
    throw error;
  }
};

export const fetchUserFromDatabase = async (email: string): Promise<{ user: UserData; token: string }> => {
  console.log("🔵 userAuthService: Fetching user from database:", email);
  
  try {
    const response = await fetch(`/api/proxy/users/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user from database');
    }

    const data = await response.json();
    console.log("✅ userAuthService: User fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ userAuthService: Failed to fetch user:", error);
    throw error;
  }
};