import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (user?.isAuthenticated) {
      console.log("PreloaderPage: User authenticated. Redirecting to /welcome.");
      navigate("/welcome", { replace: true });
      return;
    }

    const loadingTimer = setTimeout(() => {
      console.log("PreloaderPage: Initializing Phaser game.");

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: window.innerWidth,
        height: window.innerHeight,
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
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      console.log("PreloaderPage: Cleanup is handled during logout.");
      // Do not destroy the game instance here
    };
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    gameStore.destroyGameInstance(); // Now, destroy the Phaser instance
    console.log("PreloaderPage: User logged out, Phaser game instance destroyed.");
  };

  return (
    <div className="relative w-full h-screen bg-nightsky">
      <div id="game-container" className="absolute inset-0" />

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