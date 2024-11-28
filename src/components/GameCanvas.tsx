import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import { useIsMobile } from '@/hooks/use-mobile';

const GameCanvas = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('Initializing GameCanvas with responsive config');
    const container = document.getElementById('game-container');
    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: width,
      height: height,
      backgroundColor: '#1A1F2C',
      scene: [SlotGameScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
      }
    };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      console.log('Window resized, updating game size');
      const newWidth = container?.clientWidth || window.innerWidth;
      const newHeight = container?.clientHeight || window.innerHeight;
      game.scale.resize(newWidth, newHeight);
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
      className="w-full h-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center p-2 md:p-4 bg-nightsky rounded-lg"
    />
  );
};

export default GameCanvas;