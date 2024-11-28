import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import { useIsMobile } from '@/hooks/use-mobile';

const GameCanvas = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('Initializing GameCanvas with responsive config');
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: isMobile ? window.innerWidth * 0.95 : 1024,
      height: isMobile ? window.innerHeight * 0.6 : 768,
      backgroundColor: '#1A1F2C',
      scene: [SlotGameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      console.log('Window resized, updating game size');
      game.scale.resize(
        isMobile ? window.innerWidth * 0.95 : 1024,
        isMobile ? window.innerHeight * 0.6 : 768
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('Cleaning up GameCanvas');
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
    };
  }, [isMobile]);

  return (
    <div 
      id="game-container" 
      className="w-full h-full min-h-[50vh] md:min-h-[768px] flex items-center justify-center p-2 md:p-4"
    />
  );
};

export default GameCanvas;