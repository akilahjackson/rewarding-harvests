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
      transparent: true, // Enable transparency
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
    <div className="relative w-full h-full min-h-[80vh] overflow-hidden rounded-xl">
      {/* Animated background with crop circles */}
      <div className="absolute inset-0 bg-gradient-to-b from-nightsky to-harvestorange/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517022812141-23620dba5c23')] bg-cover bg-center opacity-10" />
        <div className="absolute w-32 h-32 rounded-full border-2 border-neongreen/30 animate-float left-1/4 top-1/4 blur-sm" />
        <div className="absolute w-48 h-48 rounded-full border-2 border-neongreen/30 animate-float delay-1000 right-1/3 bottom-1/3 blur-sm" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-neongreen/30 animate-float delay-2000 left-1/3 bottom-1/4 blur-sm" />
      </div>
      
      {/* Game container with transparent background */}
      <div 
        id="game-container" 
        className="relative w-full h-full flex items-center justify-center p-4 backdrop-blur-sm bg-transparent rounded-xl shadow-lg border border-neongreen/20"
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-neongreen rounded-full animate-float top-1/4 left-1/4 opacity-50" />
        <div className="absolute w-2 h-2 bg-neongreen rounded-full animate-float delay-1000 top-3/4 right-1/4 opacity-50" />
        <div className="absolute w-2 h-2 bg-neongreen rounded-full animate-float delay-2000 top-1/2 left-1/2 opacity-50" />
      </div>
    </div>
  );
};

export default GameCanvas;