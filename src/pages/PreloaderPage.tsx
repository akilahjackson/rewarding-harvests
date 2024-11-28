import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import Phaser from 'phaser';
import { Card, CardContent } from '@/components/ui/card';
import { LOADING_MESSAGES } from '@/scenes/constants/loadingMessages';

const PreloaderPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Initializing PreloaderPage');
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth < 768 ? window.innerWidth * 0.9 : 800,
      height: window.innerHeight * 0.5,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#000000',
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
      <div id="game-container" className="w-full max-w-4xl mx-auto" />
      <Card className="w-full max-w-xl mt-4 bg-opacity-20 backdrop-blur-sm bg-black border-neongreen">
        <CardContent className="p-6">
          <div id="progress-container" className="text-center space-y-2">
            <p className="text-neongreen font-space text-lg animate-glow-pulse">
              The Harvest Begins...
            </p>
            <div className="text-harvestpeach text-sm">
              {LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreloaderPage;