import React, { useRef, useState, useCallback, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import BettingControls from '@/components/BettingControls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlotGameScene } from '@/scenes/SlotGameScene';
import HowToPlay from '@/components/HowToPlay';

const MainGamePage = () => {
  console.log('MainGamePage: Component mounting');
  const [balance, setBalance] = useState(1.0);
  const [betAmount, setBetAmount] = useState(0.001);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const gameSceneRef = useRef<SlotGameScene | null>(null);
  const { toast } = useToast();
  const autoSpinIntervalRef = useRef<NodeJS.Timeout>();
  const bgMusicRef = useRef<Phaser.Sound.BaseSound>();

  useEffect(() => {
    console.log('MainGamePage: Component mounted, initializing game UI');
    // Start background music when component mounts
    if (gameSceneRef.current) {
      bgMusicRef.current = gameSceneRef.current.sound.add('background-music', {
        volume: 0.5,
        loop: true
      });
      bgMusicRef.current.play();
    }
    return () => {
      console.log('MainGamePage: Component unmounting');
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.stop();
      }
    };
  }, []);

  const toggleMute = () => {
    console.log('MainGamePage: Toggling mute state');
    if (gameSceneRef.current) {
      const scene = gameSceneRef.current;
      const newMutedState = !isMuted;
      scene.sound.mute = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleSpin = useCallback(async () => {
    if (isSpinning || !gameSceneRef.current) return;
    
    if (betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSpinning(true);
      setBalance(prev => prev - betAmount);
      
      const multiplier = isAutoSpin ? 2 : 1;
      const { totalWinAmount, winningLines } = await gameSceneRef.current.startSpin(betAmount, multiplier);
      
      if (totalWinAmount > 0) {
        const hrvestTokens = totalWinAmount * 1000;
        setTotalWinnings(prev => prev + hrvestTokens);
        setBalance(prev => prev + totalWinAmount);

        // Check if it's a big win (50x or more)
        const isBigWin = totalWinAmount >= betAmount * 50;
        
        if (isBigWin) {
          // Pause background music
          if (bgMusicRef.current?.isPlaying) {
            bgMusicRef.current.pause();
          }
          
          // Play big win sound
          const bigWinSound = gameSceneRef.current.sound.add('big-win-sound', { volume: 0.8 });
          bigWinSound.play();
          bigWinSound.once('complete', () => {
            // Resume background music after big win sound
            if (bgMusicRef.current && !isMuted) {
              bgMusicRef.current.resume();
            }
          });

          toast({
            title: "🎉 BIG WIN! 🎉",
            description: `${hrvestTokens.toFixed(0)} HRVST`,
            duration: 5000,
          });
        } else {
          toast({
            title: "Win!",
            description: `${hrvestTokens.toFixed(0)} HRVST`,
            duration: 2000,
          });
        }
      } else {
        toast({
          title: "No Win",
          description: "Try again!",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Spin error:', error);
      toast({
        title: "Error",
        description: "Something went wrong during the spin.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  }, [betAmount, balance, isAutoSpin, toast, isSpinning, isMuted]);

  const toggleAutoSpin = useCallback(() => {
    console.log('MainGamePage: Toggling auto-spin. Current state:', isAutoSpin);
    
    if (isAutoSpin) {
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
        autoSpinIntervalRef.current = undefined;
      }
      setIsAutoSpin(false);
      console.log('MainGamePage: Auto-spin stopped');
    } else {
      setIsAutoSpin(true);
      console.log('MainGamePage: Auto-spin started');
      autoSpinIntervalRef.current = setInterval(() => {
        if (!isSpinning && betAmount <= balance) {
          handleSpin();
        } else if (betAmount > balance) {
          clearInterval(autoSpinIntervalRef.current);
          autoSpinIntervalRef.current = undefined;
          setIsAutoSpin(false);
          console.log('MainGamePage: Auto-spin stopped due to insufficient balance');
        }
      }, 3000);
    }
  }, [isAutoSpin, isSpinning, balance, betAmount, handleSpin]);

  useEffect(() => {
    return () => {
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
    };
  }, []);

  const handleSceneCreated = useCallback((scene: SlotGameScene) => {
    console.log('MainGamePage: Game scene created and ready');
    gameSceneRef.current = scene;
  }, []);

  console.log('MainGamePage: Rendering component with state:', {
    balance,
    betAmount,
    isSpinning,
    isAutoSpin,
    isMuted
  });

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('/images/neon-crop-circles.WEBP')] bg-cover bg-center opacity-30"
        style={{ backgroundBlendMode: 'overlay' }}
      />
      
      <div className="relative w-full h-full flex flex-col">
        <div className="w-full flex flex-wrap justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm border-b border-neongreen/20">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              <Coins className="w-4 h-4 mr-1" />
              Balance: {balance.toFixed(3)} SOL
            </Badge>
            <Badge variant="outline" className="bg-neongreen/20 text-neongreen border-neongreen">
              Total Winnings: {totalWinnings.toFixed(0)} HRVST
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="bg-nightsky/50 border-neongreen"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-neongreen" />
              ) : (
                <Volume2 className="h-5 w-5 text-neongreen" />
              )}
            </Button>
            <HowToPlay />
          </div>
        </div>

        <div className="flex-1 w-full">
          <GameCanvas onSceneCreated={handleSceneCreated} />
        </div>

        <BettingControls
          balance={balance}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          totalWinnings={totalWinnings}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          isAutoSpin={isAutoSpin}
          onAutoSpinToggle={toggleAutoSpin}
        />
      </div>
    </div>
  );
};
