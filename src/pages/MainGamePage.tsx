import React, { useRef, useState, useCallback, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import BettingControls from '@/components/BettingControls';
import { Badge } from '@/components/ui/badge';
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlotGameScene } from '@/scenes/SlotGameScene';
import HowToPlay from '@/components/HowToPlay';
import { getWinToastMessage, getLoseToastMessage } from '@/utils/toastMessages';

export const MainGamePage = () => {
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

  const toggleMute = useCallback(() => {
    console.log('MainGamePage: Toggling mute state');
    if (gameSceneRef.current) {
      const scene = gameSceneRef.current;
      const newMutedState = !isMuted;
      scene.sound.mute = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  const handleSpin = useCallback(async () => {
    console.log('MainGamePage: handleSpin called');
    if (isSpinning || !gameSceneRef.current) {
      console.log('MainGamePage: Spin blocked - already spinning or no game scene');
      return;
    }
    
    if (betAmount > balance) {
      console.log('MainGamePage: Insufficient balance');
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('MainGamePage: Starting spin sequence');
      setIsSpinning(true);
      setBalance(prev => prev - betAmount);
      
      const multiplier = isAutoSpin ? 2 : 1;
      console.log('MainGamePage: Calling game scene startSpin');
      const { totalWinAmount, winningLines } = await gameSceneRef.current.startSpin(betAmount, multiplier);
      console.log('MainGamePage: Spin complete, processing results:', { totalWinAmount, winningLines });
      
      if (totalWinAmount > 0) {
        const hrvestTokens = totalWinAmount * 1000;
        setTotalWinnings(prev => prev + hrvestTokens);
        setBalance(prev => prev + totalWinAmount);

        const isBigWin = totalWinAmount >= betAmount * 50;
        
        if (isBigWin && bgMusicRef.current?.isPlaying) {
          bgMusicRef.current.pause();
          
          const bigWinSound = gameSceneRef.current.sound.add('big-win-sound', { volume: 0.8 });
          bigWinSound.play();
          bigWinSound.once('complete', () => {
            if (bgMusicRef.current && !isMuted) {
              bgMusicRef.current.resume();
            }
          });
        }

        toast(getWinToastMessage(hrvestTokens, isBigWin));
      } else {
        toast(getLoseToastMessage());
      }
    } catch (error) {
      console.error('MainGamePage: Spin error:', error);
      toast({
        title: "Error",
        description: "Something went wrong during the spin.",
        variant: "destructive",
      });
    } finally {
      console.log('MainGamePage: Spin sequence complete');
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
    } else {
      setIsAutoSpin(true);
      autoSpinIntervalRef.current = setInterval(() => {
        if (!isSpinning && betAmount <= balance) {
          handleSpin();
        } else if (betAmount > balance) {
          clearInterval(autoSpinIntervalRef.current);
          autoSpinIntervalRef.current = undefined;
          setIsAutoSpin(false);
        }
      }, 3000);
    }
  }, [isAutoSpin, isSpinning, balance, betAmount, handleSpin]);

  const handleSceneCreated = useCallback((scene: SlotGameScene) => {
    console.log('MainGamePage: Game scene created and ready');
    gameSceneRef.current = scene;
    
    // Wait for assets to be loaded before initializing background music
    scene.events.once('assetsLoaded', () => {
      console.log('MainGamePage: Assets loaded, initializing background music');
      bgMusicRef.current = scene.sound.add('background-music', {
        volume: 0.5,
        loop: true
      });
      bgMusicRef.current.play();
    });
  }, []);

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('/images/neon-crop-circles.WEBP')] bg-cover bg-center opacity-30"
        style={{ backgroundBlendMode: 'overlay' }}
      />
      
      <div className="relative w-full h-full flex flex-col">
        <div className="w-full flex justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm border-b border-neongreen/20">
          <div className="flex gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              <Coins className="w-4 h-4 mr-1" />
              Balance: {balance.toFixed(3)} SOL
            </Badge>
            <Badge variant="outline" className="bg-neongreen/20 text-neongreen border-neongreen">
              Total Winnings: {totalWinnings.toFixed(0)} HRVST
            </Badge>
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
          isMuted={isMuted}
          onMuteToggle={toggleMute}
          helpButton={<HowToPlay />}
        />
      </div>
    </div>
  );
};
