import React, { createContext, useContext, useEffect, useRef } from "react";
import Phaser from "phaser";
import { gameStore } from "@/stores/GameStore"; // Import GameStore

const GameContext = createContext<Phaser.Game | null>(null);

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameInstanceRef.current) {
      console.log("GameContext: Initializing Phaser game instance.");

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [/* Your Scenes */],
      };

      gameInstanceRef.current = new Phaser.Game(config);

      // Notify the GameStore about the game instance
      if (gameStore.connectToGameInstance) {
        gameStore.connectToGameInstance(gameInstanceRef.current);
      } else {
        console.error("GameContext: connectToGameInstance is not defined.");
      }
    } else {
      console.log("GameContext: Reusing existing Phaser game instance.");
    }

    return () => {
      console.log("GameContext: Cleaning up game instance.");

      // Notify GameStore to destroy the instance reference
      if (gameStore.destroyGameInstance) {
        gameStore.destroyGameInstance();
      } else {
        console.error("GameContext: destroyGameInstance is not defined.");
      }

      gameInstanceRef.current?.destroy(true);
      gameInstanceRef.current = null;
    };
  }, []);

  return (
    <GameContext.Provider value={gameInstanceRef.current}>
      {children}
    </GameContext.Provider>
  );
};
