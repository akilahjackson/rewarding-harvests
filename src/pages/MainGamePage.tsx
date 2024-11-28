import React, { useRef, useState, useCallback, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import BettingControls from '@/components/BettingControls';
import { Badge } from '@/components/ui/badge';
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlotGameScene } from '@/scenes/SlotGameScene';

const MainGamePage = () => {
  const [balance, setBalance] = useState(1.0);
  const [betAmount, setBetAmount] = useState(0.001);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const gameSceneRef = useRef<SlotGameScene | null>(null);
  const { toast } = useToast();
  const autoSpinIntervalRef = useRef<NodeJS.Timeout>();

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
      console.log('MainGamePage: Starting spin with bet:', betAmount);

      const multiplier = isAutoSpin ? 2 : 1;
      const winAmount = await gameSceneRef.current.startSpin(betAmount, multiplier);
      
      if (winAmount > 0) {
        const hrvestTokens = winAmount * 1000;
        setTotalWinnings(prev => prev + hrvestTokens);
        setBalance(prev => prev + winAmount);
        toast({
          title: "Winner! 🎉",
          description: `You won ${hrvestTokens.toFixed(0)} HRVST tokens!`,
        });
      }
    } catch (error) {
      console.error('MainGamePage: Spin error:', error);
      toast({
        title: "Error",
        description: "Something went wrong during the spin.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  }, [betAmount, balance, isAutoSpin, toast, isSpinning]);

  const toggleAutoSpin = useCallback(() => {
    console.log('MainGamePage: Toggling auto-spin. Current state:', isAutoSpin);
    
    if (isAutoSpin) {
      // Stop auto-spin
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
        autoSpinIntervalRef.current = undefined;
      }
      setIsAutoSpin(false);
      console.log('MainGamePage: Auto-spin stopped');
    } else {
      // Start auto-spin
      setIsAutoSpin(true);
      console.log('MainGamePage: Auto-spin started');
      autoSpinIntervalRef.current = setInterval(() => {
        if (!isSpinning && betAmount <= balance) {
          handleSpin();
        } else if (betAmount > balance) {
          // Stop auto-spin if insufficient balance
          clearInterval(autoSpinIntervalRef.current);
          autoSpinIntervalRef.current = undefined;
          setIsAutoSpin(false);
          console.log('MainGamePage: Auto-spin stopped due to insufficient balance');
        }
      }, 3000);
    }
  }, [isAutoSpin, isSpinning, balance, betAmount, handleSpin]);

  // Cleanup interval on unmount
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

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center opacity-30" />
      
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
          <Badge variant="outline" className="bg-harvestpeach/20 text-harvestpeach border-harvestpeach">
            Current Bet: {betAmount.toFixed(3)} SOL
          </Badge>
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

export default MainGamePage;