import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from "lucide-react";

interface GameCanvasProps {
  onSceneCreated?: (scene: SlotGameScene) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onSceneCreated }) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing GameCanvas with responsive config');
    const container = document.getElementById('game-container');
    if (!container) return;

    const updateDimensions = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      return { width, height };
    };

    const { width, height } = updateDimensions();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: width,
      height: height,
      transparent: true,
      scene: [SlotGameScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
      },
      callbacks: {
        postBoot: (game) => {
          console.log('Game loaded successfully');
          const scene = game.scene.getScene('SlotGameScene') as SlotGameScene;
          if (onSceneCreated) {
            onSceneCreated(scene);
          }
          setTimeout(() => setIsLoading(false), 1000);
        }
      }
    };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      console.log('Window resized, updating game size');
      const { width: newWidth, height: newHeight } = updateDimensions();
      game.scale.resize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('Cleaning up GameCanvas');
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
    };
  }, [isMobile, onSceneCreated]);

  return (
    <div className="relative w-full h-full min-h-[60vh] md:min-h-[70vh] overflow-hidden rounded-xl">
      {isLoading && (
        <div className="absolute inset-0 bg-nightsky/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-neongreen mx-auto" />
            <p className="text-neongreen font-space animate-pulse">Loading Harvest Slots...</p>
          </div>
        </div>
      )}
      
      <div 
        id="game-container" 
        className={`relative w-full h-full flex items-center justify-center backdrop-blur-sm bg-transparent rounded-xl shadow-lg border border-neongreen/20 transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default GameCanvas;