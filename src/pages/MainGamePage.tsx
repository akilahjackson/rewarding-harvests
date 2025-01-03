import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import GameCanvas from "@/components/GameCanvas";
import BettingControls from "@/components/BettingControls";
import UserMenuBar from "@/components/UserMenuBar";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HowToPlay from "@/components/HowToPlay";
import { SlotGameScene } from "@/scenes/SlotGameScene";
import { getWinToastMessage, getLoseToastMessage } from "@/utils/toastMessages";
import { useStore } from "@/contexts/StoreContext";

export const MainGamePage = observer(() => {
  const navigate = useNavigate();
  const { userStore, gameStore } = useStore();
  const [showHelp, setShowHelp] = useState(false);
  const [gameScene, setGameScene] = useState<SlotGameScene | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Log user authentication status
    console.log("MainGamePage: Checking authenticated user", userStore.user);
    if (!userStore.user) {
      console.warn("MainGamePage: No authenticated user, redirecting to home.");
      navigate("/");
      return;
    }

    // Log game store state on load
    console.log("MainGamePage: Initial gameStore state", { ...gameStore });

    // Initialize background music
    const bgMusic = new Audio("/sounds/background-music.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    if (!gameStore.isMuted) {
      bgMusic.play().catch((error) =>
        console.warn("MainGamePage: Audio playback failed:", error)
      );
    } else {
      console.log("MainGamePage: GameStore is muted, skipping audio playback.");
    }

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      console.log("MainGamePage: Cleaned up background music.");
    };
  }, [navigate, userStore.user, gameStore.isMuted]);

  const handleSceneCreated = useCallback((scene: SlotGameScene) => {
    console.log("MainGamePage: Game scene created successfully", scene);
    setGameScene(scene);
  }, []);

  const handleSpin = async () => {
    console.log("MainGamePage: Attempting to spin with bet:", gameStore.betAmount);

    if (!gameScene) {
      console.warn("MainGamePage: GameScene is not initialized.");
      toast({
        title: "Game not ready",
        description: "Please wait until the game loads completely.",
        variant: "destructive",
      });
      return;
    }

    if (gameStore.betAmount > gameStore.balance) {
      console.warn("MainGamePage: Insufficient balance for bet:", {
        betAmount: gameStore.betAmount,
        balance: gameStore.balance,
      });
      toast({
        title: "Insufficient Balance",
        description: "Please lower your bet amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("MainGamePage: Placing bet and starting spin...");
      gameStore.placeBet();

      const { totalWinAmount, winningLines } = await gameScene.startSpin(
        gameStore.betAmount,
        1
      );
      console.log("MainGamePage: Spin result:", { totalWinAmount, winningLines });

      if (winningLines.length > 0) {
        console.log("MainGamePage: Updating gameStore after win.");
        gameStore.updateAfterSpin(totalWinAmount);
        toast(getWinToastMessage(totalWinAmount, totalWinAmount >= gameStore.betAmount * 50));
      } else {
        console.log("MainGamePage: Spin resulted in no wins.");
        gameStore.setSpinning(false);
        toast(getLoseToastMessage());
      }
    } catch (error) {
      console.error("MainGamePage: Error during spin:", error);
      toast({
        title: "Error",
        description: "An error occurred during spin.",
        variant: "destructive",
      });
      gameStore.setSpinning(false);
    }
  };

  // Log render without user
  if (!userStore.user) {
    console.warn("MainGamePage: Render skipped because no user is authenticated.");
    return null;
  }

  return (
    <div className="min-h-screen bg-nightsky relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/images/neon-crop-circles.WEBP')` }}
      />
      <UserMenuBar />

      <div className="pt-16">
        <GameCanvas onSceneCreated={handleSceneCreated} />

        <BettingControls
          onSpin={handleSpin}
          helpButton={
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHelp(true)}
              className="bg-nightsky/50 border-neongreen"
            >
              <HelpCircle className="h-6 w-6 text-neongreen" />
            </Button>
          }
        />
      </div>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play</DialogTitle>
          </DialogHeader>
          <HowToPlay />
        </DialogContent>
      </Dialog>
    </div>
  );
});
