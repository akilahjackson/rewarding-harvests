import { API_BACKEND_URL } from '../api/apiConfig';

export const loginUser = async (email: string): Promise<any> => {
  console.log("🔵 userAuthService: Attempting login with email:", email);
  
  try {
    const response = await fetch(`${API_BACKEND_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include', // Include credentials in the request
    });

    if (!response.ok) {
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