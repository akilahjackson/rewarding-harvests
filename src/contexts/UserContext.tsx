import React, { createContext, useContext, useState, useEffect } from "react";

interface UserState {
  email: string;
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const stored = localStorage.getItem("gameshift_user");
    const parsed = stored ? JSON.parse(stored) : null;
    console.log("🔵 UserProvider: Initial user state loaded from localStorage:", parsed);
    return parsed;
  });

  const updateLastActive = async () => {
    if (!user) {
      console.log("⚠️ UserProvider: Cannot update lastActive - no user logged in");
      return;
    }

    const updatedUser = {
      ...user,
      lastActive: new Date().toISOString(),
    };

    console.log("🔵 UserProvider: Updating last active:", updatedUser);

    setUser(updatedUser);
    localStorage.setItem("gameshift_user", JSON.stringify(updatedUser));
    console.log("✅ UserProvider: Updated user state in localStorage");

    try {
      const response = await fetch("/api/users/updateLastActive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.tokenBalance}`,
        },
        body: JSON.stringify({ lastActive: updatedUser.lastActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update last active in the backend");
      }

      console.log("✅ UserProvider: Successfully updated last active in backend");
    } catch (error) {
      console.error("❌ UserProvider: Failed to sync last active:", error);
    }
  };

  const logout = async () => {
    console.log("🔵 UserProvider: Logging out user:", user?.email);

    try {
      if (user?.tokenBalance) {
        await fetch("/api/users/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.tokenBalance}`,
          },
        });
        console.log("✅ UserProvider: Successfully notified backend of logout");
      }
    } catch (error) {
      console.error("❌ UserProvider: Failed to notify backend of logout:", error);
    }

    localStorage.removeItem("gameshift_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    console.log("✅ UserProvider: Cleared local storage and reset user state");
  };

  useEffect(() => {
    const checkSession = () => {
      if (!user?.lastActive) return;

      const inactiveTime = new Date().getTime() - new Date(user.lastActive).getTime();
      console.log("🔵 UserProvider: Checking session. Inactive time:", inactiveTime);

      if (inactiveTime > 15 * 60 * 1000) {
        console.warn("⚠️ UserProvider: User session expired. Logging out...");
        logout();
      }
    };

    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, updateLastActive, logout }}>
      {children}
    </UserContext.Provider>
  );
};