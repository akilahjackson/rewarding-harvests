import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import Phaser from 'phaser';

const PreloaderPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Initializing PreloaderPage');
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#1a1f2c',
      scene: PreloaderScene
    };

    const game = new Phaser.Game(config);

    // Navigate to main game after preloader completes
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
    <div className="w-full h-screen bg-nightsky">
      <div id="game-container" className="w-full h-full" />
    </div>
  );
};

export default PreloaderPage;