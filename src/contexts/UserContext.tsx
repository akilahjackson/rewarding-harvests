import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
   * Update Last Active Timestamp Using Player Actions API
   */
  const updateLastActive = useCallback(async () => {
    if (!user) {
      console.warn("⚠️ UserProvider: Cannot update last active - no user logged in");
      return;
    }

    const updatedUser = {
      ...user,
      lastActive: new Date().toISOString(),
    };

    // Update local state and localStorage
    setUser(updatedUser);
    localStorage.setItem("gameshift_user", JSON.stringify(updatedUser));

    try {
      const response = await fetch("/api/player-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.tokenBalance}`,
        },
        body: JSON.stringify({
          playerId: user.gameshiftId,        // Correct playerId
          playerEmail: user.email,           // Correct playerEmail
          playerWallet: user.walletAddress || "unknown",
          actionType: "user_active",         // Custom action type
          actionDescription: "User last active update",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update last active in the backend");
      }

      console.log("✅ UserProvider: Successfully logged last active action");
    } catch (error) {
      console.error("❌ UserProvider: Failed to sync last active:", error);
    }
  }, [user]);

  /**
   * Logout the Current User
   */
  const logout = useCallback(async () => {
    console.log("🔵 UserProvider: Logging out user:", user?.email);

    try {
      if (user?.tokenBalance) {
        const response = await fetch("/api/users/logout", {
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
      }
    } catch (error) {
      console.error("❌ UserProvider: Logout API call failed:", error);
    } finally {
      // Clear local storage and reset state
      localStorage.removeItem("gameshift_user");
      localStorage.removeItem("auth_token");
      setUser(null);
      console.log("✅ UserProvider: Cleared local storage and reset user state");
    }
  }, [user]);

  /**
   * Automatic Session Management with Inactivity Check
   */
  useEffect(() => {
    const checkSession = () => {
      if (!user?.lastActive) return;

      const inactiveTime = Date.now() - new Date(user.lastActive).getTime();

      if (inactiveTime > 15 * 60 * 1000) {
        console.warn("⚠️ UserProvider: Session expired. Logging out...");
        logout(); // Logout user after inactivity
      } else {
        updateLastActive(); // Optionally refresh last active status
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, logout, updateLastActive]);

  // Provide the context value
  const value = {
    user,
    setUser,
    updateLastActive,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;