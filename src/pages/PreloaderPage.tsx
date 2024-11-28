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
    <div className="w-full min-h-screen bg-nightsky">
      <div id="game-container" className="w-full h-full" />
    </div>
  );
};

export default PreloaderPage;