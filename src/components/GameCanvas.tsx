import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from "lucide-react";

interface GameCanvasProps {
  onSceneCreated?: (scene: SlotGameScene) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onSceneCreated }) => {
  console.log('GameCanvas: Component mounting');
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('GameCanvas: Initial mount');
    if (!containerRef.current || gameRef.current) {
      console.log('GameCanvas: Container not ready or game already initialized');
      return;
    }

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
      transparent: true,
      scene: SlotGameScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
      },
      dom: {
        createContainer: true
      },
      callbacks: {
        postBoot: (game) => {
          console.log('GameCanvas: Game loaded successfully');
          const scene = game.scene.getScene('SlotGameScene') as SlotGameScene;
          if (onSceneCreated) {
            onSceneCreated(scene);
          }
          setIsLoading(false);
        }
      }
    };

    try {
      console.log('GameCanvas: Attempting to create new Phaser game instance');
      gameRef.current = new Phaser.Game(config);
      console.log('GameCanvas: Successfully created Phaser game instance');
    } catch (error) {
      console.error('GameCanvas: Error creating Phaser game instance:', error);
      setIsLoading(false);
    }

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
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-neongreen mx-auto" />
            <p className="text-neongreen font-space animate-pulse">Loading Harvest Slots...</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        style={{ border: 'none', outline: 'none' }}
      />
    </div>
  );
};

export default GameCanvas;