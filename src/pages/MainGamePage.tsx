import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import GameCanvas from '@/components/GameCanvas';
import BettingControls from '@/components/BettingControls';
import UserMenuBar from '@/components/UserMenuBar';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HowToPlay from '@/components/HowToPlay';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import { getWinToastMessage, getLoseToastMessage } from '@/utils/toastMessages';
import { useStore } from '@/contexts/StoreContext';

export const MainGamePage = observer(() => {
  const navigate = useNavigate();
  const { userStore, gameStore } = useStore();
  const [showHelp, setShowHelp] = useState(false);
  const [gameScene, setGameScene] = useState<SlotGameScene | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userStore.user) {
      navigate('/');
      return;
    }

    // Initialize background music
    const bgMusic = new Audio('/sounds/background-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    if (!gameStore.isMuted) {
      bgMusic.play().catch(error => console.log('Audio playback failed:', error));
    }

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [navigate, userStore.user, gameStore.isMuted]);

  const handleSceneCreated = useCallback((scene: SlotGameScene) => {
    console.log('MainGamePage: Game scene created');
    setGameScene(scene);
  }, []);

  const handleSpin = async () => {
    if (!gameScene || gameStore.betAmount > gameStore.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please lower your bet amount.",
        variant: "destructive"
      });
      return;
    }

    try {
      gameStore.placeBet();
      const { totalWinAmount, winningLines } = await gameScene.startSpin(gameStore.betAmount, 1);
      
      if (winningLines.length > 0) {
        gameStore.updateAfterSpin(totalWinAmount);
        
        const isBigWin = totalWinAmount >= gameStore.betAmount * 50;
        const toastConfig = getWinToastMessage(totalWinAmount, isBigWin);
        toast(toastConfig);
      } else {
        gameStore.setSpinning(false);
        const toastConfig = getLoseToastMessage();
        toast(toastConfig);
      }
    } catch (error) {
      console.error('Error during spin:', error);
      toast({
        title: "Error",
        description: "An error occurred during spin.",
        variant: "destructive"
      });
      gameStore.setSpinning(false);
    }
  };

  if (!userStore.user) return null;

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