import React, { useState, useEffect } from "react";
import Phaser from "phaser";
import { PreloaderScene } from "@/scenes/PreloaderScene";
import AuthForm from "@/components/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const PreloaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUser();
  const [isGameReady, setIsGameReady] = useState(false);

  useEffect(() => {
    if (user?.isAuthenticated) {
      console.log("PreloaderPage: User is authenticated, redirecting.");
      navigate("/welcome", { replace: true });
      return;
    }

    console.log("PreloaderPage: Initializing Phaser game.");

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "game-container",
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#1A1F2C",
      scene: PreloaderScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      audio: {
        disableWebAudio: false,
      },
    };

    const game = new Phaser.Game(config);

    // Listen for the "ready" event from PreloaderScene
    setTimeout(() => {
      const preloaderScene = game.scene.getScene("PreloaderScene") as PreloaderScene | null;

      if (preloaderScene) {
        preloaderScene.events.once("ready", () => {
          console.log("PreloaderPage: PreloaderScene is ready. Setting game ready state.");
          setIsGameReady(true);
        });
      } else {
        console.error("PreloaderPage: PreloaderScene not found.");
      }
    }, 100);

    return () => {
      console.log("PreloaderPage: Cleaning up Phaser game instance.");
      game.destroy(true);
    };
  }, [navigate, user]);

  return (
    <div className="relative w-full h-screen bg-nightsky">
      <div id="game-container" className="absolute inset-0" />

      {/* Show status message while Phaser is not ready */}
      {!isGameReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-2xl font-bold">Loading game...</h1>
        </div>
      )}

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-transparent border-none shadow-none">
          <AuthForm onSuccess={() => setShowAuthModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreloaderPage;
