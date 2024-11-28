import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const GameCanvas = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#1a1f2c',
      scene: {
        preload: function() {
          // Preload assets here
          console.log('Preloading game assets...');
        },
        create: function() {
          // Create game objects here
          console.log('Creating game scene...');
          const text = this.add.text(400, 300, 'Harvest Slots', {
            fontSize: '32px',
            color: '#4AE54A'
          });
          text.setOrigin(0.5);
        }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div 
      ref={gameRef} 
      className="w-full max-w-4xl h-[600px] rounded-lg overflow-hidden shadow-lg"
    />
  );
};

export default GameCanvas;