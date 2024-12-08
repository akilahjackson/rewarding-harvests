import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const MainGamePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [gameScene, setGameScene] = useState<SlotGameScene | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('gameshift_user');
    if (!userStr) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Initialize background music
    const bgMusic = new Audio('/sounds/background-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch(error => console.log('Audio playback failed:', error));

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [navigate]);

  const handleSceneCreated = useCallback((scene: SlotGameScene) => {
    console.log('MainGamePage: Game scene created');
    setGameScene(scene);
  }, []);

  const handleSpin = async () => {
    if (!gameScene || betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please lower your bet amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - betAmount);

    try {
      const { totalWinAmount, winningLines } = await gameScene.startSpin(betAmount, 1);
      
      if (winningLines.length > 0) {
        setBalance(prev => prev + totalWinAmount);
        setTotalWinnings(prev => prev + totalWinAmount);
        
        const isBigWin = totalWinAmount >= betAmount * 50;
        const toastConfig = getWinToastMessage(totalWinAmount, isBigWin);
        toast(toastConfig);
      } else {
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
    } finally {
      setIsSpinning(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-nightsky relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/images/neon-crop-circles.WEBP')` }}
      />
      
      <UserMenuBar />

      <div className="pt-16"> {/* Added padding-top to account for fixed UserMenuBar */}
        <GameCanvas onSceneCreated={handleSceneCreated} />

        <BettingControls
          balance={balance}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          totalWinnings={totalWinnings}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          isAutoSpin={isAutoSpin}
          onAutoSpinToggle={() => setIsAutoSpin(!isAutoSpin)}
          isMuted={isMuted}
          onMuteToggle={() => {
            setIsMuted(!isMuted);
            if (gameScene) {
              gameScene.soundManager?.toggleMute(!isMuted);
            }
          }}
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
};