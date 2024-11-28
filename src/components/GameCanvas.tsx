import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useIsMobile } from '@/hooks/use-mobile';

const GameCanvas = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!gameRef.current) return;

    const getGameDimensions = () => {
      const width = Math.min(window.innerWidth - 32, 800); // 32px for padding
      const height = Math.min(window.innerHeight - 200, 600); // 200px for UI elements
      return { width, height };
    };

    const { width, height } = getGameDimensions();
    console.log('Initializing game with dimensions:', { width, height });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width,
      height,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#1a1f2c',
      scene: {
        preload: function() {
          console.log('Preloading game assets...');
        },
        create: function() {
          console.log('Creating game scene...');
          const text = this.add.text(width / 2, height / 2, 'Harvest Slots', {
            fontSize: isMobile ? '24px' : '32px',
            color: '#4AE54A'
          });
          text.setOrigin(0.5);
        }
      }
    };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      const { width, height } = getGameDimensions();
      game.scale.resize(width, height);
      console.log('Game resized to:', { width, height });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
    };
  }, [isMobile]);

  return (
    <div 
      ref={gameRef} 
      className="w-full h-full min-h-[300px] rounded-lg overflow-hidden shadow-lg"
    />
  );
};

export default GameCanvas;