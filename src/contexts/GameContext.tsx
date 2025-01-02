import React, { createContext, useRef, useEffect } from "react";
import Phaser from "phaser";
import { gameStore } from "@/stores/GameStore";
import { PreloaderScene } from "@/scenes/PreloaderScene";
import { SlotGameScene } from "@/scenes/SlotGameScene";
import { MainGameScene} from "@/scenes/MainGameScene";

// Create a context for the Phaser game instance
export const GameContext = createContext<Phaser.Game | null>(null);

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Ref to hold the Phaser game instance
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Initialize Phaser game instance if it hasn't been created
    if (!gameInstanceRef.current) {
      console.log("GameContext: Initializing Phaser game instance.");

      gameInstanceRef.current = new Phaser.Game({
        type: Phaser.AUTO, // Automatically choose WebGL or Canvas
        parent: "game-container", // Attach the game to this DOM element
        width: 800, // Game width
        height: 600, // Game height
        scene: [PreloaderScene, MainGameScene, SlotGameScene], // Include scenes
      });

      // Connect the game instance to the GameStore
      gameStore.connectToGameInstance(gameInstanceRef.current);
    }

    // Cleanup the Phaser game instance when the provider unmounts
    return () => {
      if (gameInstanceRef.current) {
        console.log("GameContext: Cleaning up game instance.");
        gameStore.destroyGameInstance(); // Destroy via GameStore
        gameInstanceRef.current = null;
      }
    };
  }, []);

  // Provide the Phaser game instance to children components
  return <GameContext.Provider value={gameInstanceRef.current}>{children}</GameContext.Provider>;
};
