import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserState {
  email: string;
  username: string;
  isAuthenticated: boolean;
  tokenBalance: string;
  lastActive: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  updateLastActive: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const stored = localStorage.getItem('gameshift_user');
    return stored ? JSON.parse(stored) : null;
  });

  const updateLastActive = () => {
    if (user) {
      const updatedUser = {
        ...user,
        lastActive: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('gameshift_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    localStorage.removeItem('gameshift_user');
    setUser(null);
  };

  useEffect(() => {
    const checkSession = () => {
      const lastActive = user?.lastActive;
      if (lastActive) {
        const inactiveTime = new Date().getTime() - new Date(lastActive).getTime();
        if (inactiveTime > 15 * 60 * 1000) { // 15 minutes
          logout();
        }
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