import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import Phaser from 'phaser';
import { Card, CardContent } from '@/components/ui/card';

const PreloaderPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Initializing PreloaderPage');
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight * 0.7, // Adjust height to leave space for the card
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#1a1f2c',
      scene: PreloaderScene
    };

    const game = new Phaser.Game(config);

    const handleSceneComplete = () => {
      console.log('Preloader complete, navigating to game');
      game.destroy(true);
      navigate('/game');
    };

    game.events.on('sceneComplete', handleSceneComplete);

    return () => {
      game.events.off('sceneComplete', handleSceneComplete);
      game.destroy(true);
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-nightsky flex flex-col items-center justify-center p-4">
      <div id="game-container" className="w-full flex-grow" />
      <Card className="w-full max-w-xl mt-4 bg-opacity-20 backdrop-blur-sm bg-nightsky border-harvestorange">
        <CardContent className="p-6">
          <div id="progress-container" className="text-center">
            <p className="text-harvestorange font-space text-lg animate-pulse">
              Establishing Contact...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreloaderPage;