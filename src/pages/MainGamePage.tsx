import React, { useRef, useState, useCallback, useEffect } from 'react';
import GameCanvas from '@/components/GameCanvas';
import BettingControls from '@/components/BettingControls';
import { Badge } from '@/components/ui/badge';
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SlotGameScene } from '@/scenes/SlotGameScene';

const MainGamePage = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const gameSceneRef = useRef<SlotGameScene | null>(null);
  const { toast } = useToast();
  const autoSpinIntervalRef = useRef<NodeJS.Timeout>();

  const calculateTotalBet = () => betAmount * multiplier;

  const handleSpin = async () => {
    if (isSpinning) return;
    
    const totalBet = calculateTotalBet();
    if (totalBet > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - totalBet);
    console.log('Starting spin with bet:', totalBet);

    try {
      if (gameSceneRef.current) {
        const winAmount = await gameSceneRef.current.startSpin(betAmount, multiplier);
        
        if (winAmount > 0) {
          setBalance(prev => prev + winAmount);
          setTotalWinnings(prev => prev + winAmount);
          toast({
            title: "Winner!",
            description: `You won ${winAmount.toFixed(2)} coins!`,
          });
        } else {
          toast({
            title: "Try Again!",
            description: "Better luck next time!",
            variant: "destructive",
          });
        }
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
  };

  const toggleAutoSpin = useCallback(() => {
    if (isAutoSpin) {
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
    } else {
      autoSpinIntervalRef.current = setInterval(() => {
        if (!isSpinning && calculateTotalBet() <= balance) {
          handleSpin();
        } else {
          if (autoSpinIntervalRef.current) {
            clearInterval(autoSpinIntervalRef.current);
            setIsAutoSpin(false);
          }
        }
      }, 3000);
    }
    setIsAutoSpin(!isAutoSpin);
  }, [isAutoSpin, isSpinning, balance, betAmount, multiplier]);

  useEffect(() => {
    return () => {
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center opacity-30" />
      
      <div className="relative w-full h-full flex flex-col items-center justify-between p-4 gap-4">
        <div className="w-full max-w-7xl flex flex-wrap justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              <Coins className="w-4 h-4 mr-1" />
              Balance: {balance.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="bg-neongreen/20 text-neongreen border-neongreen">
              Total Winnings: {totalWinnings.toFixed(2)}
            </Badge>
          </div>
          <Badge variant="outline" className="bg-harvestpeach/20 text-harvestpeach border-harvestpeach">
            Current Bet: {calculateTotalBet()}
          </Badge>
        </div>

        <div className="flex-1 w-full max-w-7xl">
          <GameCanvas onSceneCreated={(scene) => gameSceneRef.current = scene} />
        </div>

        <BettingControls
          balance={balance}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
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