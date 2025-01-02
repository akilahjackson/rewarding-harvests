import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Phaser from "phaser";
import { PreloaderScene } from "@/scenes/PreloaderScene";
import { useNavigate } from "react-router-dom";
import { gameStore } from "@/stores/GameStore";
import AuthForm from "@/components/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";

const PreloaderPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Timer for managing loading-spinner and background cleanup
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      console.log("PreloaderPage: Loading spinner finished.");
      setIsLoading(false); // Hide spinner and clean related components
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      console.log("PreloaderPage: Timer cleaned up.");
    };
  }, []);

  // Initialize Phaser game after spinner and background cleanup
  useEffect(() => {
    if (!isLoading && !gameStore.gameInstance) {
      console.log("PreloaderPage: Initializing Phaser game instance.");

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#1A1F2C", // Matches React's background
        scene: [PreloaderScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        audio: {
          disableWebAudio: false,
        },
      };

      const game = new Phaser.Game(config);

      game.scene.start("PreloaderScene", {
        showAuthModal: () => setShowAuthModal(true),
      });

      gameStore.connectToGameInstance(game);
      console.log("PreloaderPage: Phaser game instance created.");
    }
  }, [isLoading]);

  return (
    <div className="relative w-full h-screen" style={{ backgroundColor: "#1A1F2C" }}>
      {/* Spinner and background */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <h1 className="text-white text-2xl font-bold">Loading...</h1>
        </div>
      )}

      {/* Game container for Phaser */}
      {!isLoading && <div id="game-container" className="absolute inset-0" />}

      {/* Authentication Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-transparent border-none shadow-none">
          <AuthForm
            onSuccess={() => {
              console.log("AuthForm: User authenticated successfully.");
              setShowAuthModal(false);
              navigate("/welcome", { replace: true });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default PreloaderPage;
