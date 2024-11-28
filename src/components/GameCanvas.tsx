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
  const [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    console.log('Initializing GameCanvas with responsive config');
    const container = document.getElementById('game-container');
    if (!container) return;

    const getGameDimensions = () => {
      const maxHeight = window.innerHeight * 0.6;
      const width = container.clientWidth;
      const height = Math.min(container.clientHeight, maxHeight);
      return { width, height };
    };

    const { width, height } = getGameDimensions();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: width,
      height: height,
      backgroundColor: '#000000',
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

    const newGame = new Phaser.Game(config);
    setGame(newGame);

    const handleResize = () => {
      const { width: newWidth, height: newHeight } = getGameDimensions();
      newGame.scale.resize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      newGame.destroy(true);
    };
  }, [isMobile, onSceneCreated]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
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
        className="w-full h-full flex items-center justify-center bg-transparent"
      />
    </div>
  );
};

export default GameCanvas;