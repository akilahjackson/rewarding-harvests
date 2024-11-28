import React from 'react';
import GameCanvas from '@/components/GameCanvas';

const MainGamePage = () => {
  return (
    <div className="w-full min-h-screen bg-nightsky flex items-center justify-center p-4">
      <GameCanvas />
    </div>
  );
};

export default MainGamePage;