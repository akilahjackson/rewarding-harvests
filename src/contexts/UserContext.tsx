import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const API_URL = process.env["API_URL"];

interface UserState {
  email: string;
  gameshiftId: string;
  username: string;
  isAuthenticated: boolean;
  tokenBalance: string;
  lastActive: string;
  avatarUrl?: string;
  walletAddress?: string;
}

interface UserContextType {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  updateLastActive: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const stored = localStorage.getItem("gameshift_user");
    const parsed = stored ? JSON.parse(stored) : null;
    console.log("🔵 UserProvider: Initial user state loaded from localStorage:", parsed);
    return parsed;
  });

  /**
   * Set User State and Sync to LocalStorage
   */
  const handleSetUser = useCallback((user: UserState | null) => {
    console.log("🔵 UserProvider: Setting user state:", user);
    if (user) {
      localStorage.setItem("gameshift_user", JSON.stringify(user));
      console.log("✅ UserProvider: User state saved to localStorage");
    } else {
      localStorage.removeItem("gameshift_user");
      console.log("✅ UserProvider: User state cleared from localStorage");
    }
    setUser(user);
  }, []);

  /**
   * Update Last Active Timestamp Using Player Actions API
   */
  const updateLastActive = useCallback(async () => {
    if (!user) {
      console.warn("⚠️ UserProvider: Cannot update last active - no user logged in");
      return;
    }

    console.log("🔵 UserProvider: Attempting to update last active for user:", user.email);

    const updatedUser = {
      ...user,
      lastActive: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}player-actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({        playerId: user.gameshiftId,
          playerEmail: user.email,
          playerWallet: user.walletAddress || "unknown",
          actionType: "user_active",
          actionDescription: "User last active update",
          device: navigator.userAgent || 'unknown',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update last active in the backend");
      }

      console.log("✅ UserProvider: Successfully logged last active action in backend");

      // Update state and localStorage
      handleSetUser(updatedUser);
    } catch (error) {
      console.error("❌ UserProvider: Failed to sync last active:", error);
    }
  }, [user, handleSetUser]);

  /**
   * Logout the Current User
   */
  const logout = useCallback(async () => {
    console.log("🔵 UserProvider: Logging out user:", user?.email);

    try {
      if (user?.tokenBalance) {
        console.log("🔵 UserProvider: Notifying backend of logout for user:", user.email);

        const response = await fetch(`${API_URL}users/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.tokenBalance}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to notify backend of logout");
        }

        console.log("✅ UserProvider: Successfully notified backend of logout");
      } else {
        console.warn("⚠️ UserProvider: No token found for user, skipping backend notification");
      }
    } catch (error) {
      console.error("❌ UserProvider: Logout API call failed:", error);
    } finally {
      console.log("🔵 UserProvider: Clearing local storage and resetting user state");
      localStorage.removeItem("gameshift_user");
      localStorage.removeItem("auth_token");
      handleSetUser(null);
      console.log("✅ UserProvider: User state successfully reset");
    }
  }, [user, handleSetUser]);

  /**
   * Automatic Session Management with Inactivity Check
   */
  useEffect(() => {
    const checkSession = () => {
      if (!user?.lastActive) {
        console.log("🔵 UserProvider: No last active timestamp found, skipping session check");
        return;
      }

      const inactiveTime = Date.now() - new Date(user.lastActive).getTime();

      if (inactiveTime > 15 * 60 * 1000) {
        console.warn("⚠️ UserProvider: Session expired. Logging out...");
        logout(); // Logout user after inactivity
      } else {
        console.log("🔵 UserProvider: User is active, updating last active timestamp");
        updateLastActive(); // Optionally refresh last active status
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, logout, updateLastActive]);

  // Provide the context value
  const value = {
    user,
    setUser: handleSetUser,
    updateLastActive,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
