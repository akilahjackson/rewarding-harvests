import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '@/components/GameCanvas';
import UserMenu from '@/components/UserMenu';

export const MainGamePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('gameshift_user');
    if (!userStr) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Check session timeout
    const checkSession = () => {
      const lastActive = localStorage.getItem('lastActive');
      if (lastActive) {
        const inactiveTime = new Date().getTime() - new Date(lastActive).getTime();
        if (inactiveTime > 15 * 60 * 1000) { // 15 minutes
          localStorage.removeItem('gameshift_user');
          localStorage.removeItem('lastActive');
          navigate('/');
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-nightsky relative">
      <UserMenu 
        username={user.username || 'Player'}
        avatarUrl={user.avatarUrl}
        walletBalance={user.walletBalance}
        tokenBalance={user.tokenBalance}
      />
      <GameCanvas />
    </div>
  );
};