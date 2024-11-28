import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { SlotGameScene } from '@/scenes/SlotGameScene';

const GameCanvas = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      backgroundColor: '#1A1F2C',
      scene: [SlotGameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="w-full h-full" />;
};

export default GameCanvas;