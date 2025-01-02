
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import Phaser from "phaser";
import { PreloaderScene } from "@/scenes/PreloaderScene";
import AuthForm from "@/components/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { gameStore } from "@/stores/GameStore";

const PreloaderPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const gameInitialized = useRef(false);

  useEffect(() => {
    if (user?.isAuthenticated) {
      console.log("PreloaderPage: User authenticated. Redirecting to /welcome.");
      navigate("/welcome", { replace: true });
      return;
    }

    if (!gameInitialized.current && !gameStore.gameInstance) {
      const loadingTimer = setTimeout(() => {
        console.log("PreloaderPage: Initializing Phaser game.");
        setIsLoading(false); // Remove loading component before game starts
        
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: "game-container",
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: "#1A1F2C",
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
        gameInitialized.current = true;
      }, 1000); // Reduced timer to prevent overlap

      return () => {
        clearTimeout(loadingTimer);
        console.log("PreloaderPage: Timer cleaned up.");
      };
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    gameStore.destroyGameInstance();
    gameInitialized.current = false;
    console.log("PreloaderPage: User logged out, Phaser game instance destroyed.");
  };

  return (
    <div className="relative w-full h-screen">
      <div id="game-container" className="absolute inset-0" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-nightsky z-50 fade-in-out">
          <h1 className="text-white text-2xl font-bold">Loading...</h1>
        </div>
      )}

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

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
});

export default PreloaderPage;
