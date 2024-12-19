import axios from 'axios';

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
    const response = await axios.post<LoginResponse>(
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