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

      // Remove loading spinner and background after 1 second
      setTimeout(() => {
        setIsLoading(false);
        console.log("PreloaderPage: Loading spinner and background removed.");
      }, 1000);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      console.log("PreloaderPage: Cleanup is handled during logout.");
    };
  }, [navigate, user]);

  return (
    <div className="relative w-full h-screen bg-nightsky">
      <div id="game-container" className="absolute inset-0" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 fade-in-out">
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

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
});

export default PreloaderPage;
