import React, { useEffect, useState, useRef } from 'react';
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
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('GameCanvas: Initial mount');
    if (!containerRef.current || gameRef.current) return;

    const getGameDimensions = () => {
      const maxHeight = window.innerHeight * 0.6;
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = Math.min(containerRef.current?.clientHeight || window.innerHeight, maxHeight);
      return { width, height };
    };

    const { width, height } = getGameDimensions();
    console.log('GameCanvas: Creating new game instance with dimensions:', { width, height });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
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
          console.log('GameCanvas: Game loaded successfully');
          const scene = game.scene.getScene('SlotGameScene') as SlotGameScene;
          if (onSceneCreated) {
            onSceneCreated(scene);
          }
          setTimeout(() => setIsLoading(false), 1000);
        }
      }
    };

    gameRef.current = new Phaser.Game(config);

    const handleResize = () => {
      if (!gameRef.current) return;
      const { width: newWidth, height: newHeight } = getGameDimensions();
      console.log('GameCanvas: Resizing game to:', { newWidth, newHeight });
      gameRef.current.scale.resize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('GameCanvas: Cleaning up game instance');
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isMobile, onSceneCreated]);

  return (
    <div className="w-full h-[60vh] relative">
      {isLoading && (
        <div className="absolute inset-0 bg-nightsky/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-neongreen mx-auto" />
            <p className="text-neongreen font-space animate-pulse">Loading Harvest Slots...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-transparent"
      />
    </div>
  );
};

export default GameCanvas;