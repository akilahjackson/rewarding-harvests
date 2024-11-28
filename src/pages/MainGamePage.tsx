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

  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - betAmount);
    console.log('Starting spin with bet:', betAmount);

    try {
      if (gameSceneRef.current) {
        // Pass 1 as the multiplier when not in auto spin, and 2 when in auto spin
        const multiplier = isAutoSpin ? 2 : 1;
        const winAmount = await gameSceneRef.current.startSpin(betAmount, multiplier);
        
        if (winAmount > 0) {
          setBalance(prev => prev + winAmount);
          setTotalWinnings(prev => prev + winAmount);
          toast({
            title: "Winner!",
            description: `You won ${winAmount.toFixed(3)} SOL!`,
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
        if (!isSpinning && betAmount <= balance) {
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
  }, [isAutoSpin, isSpinning, balance, betAmount]);

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
      
      <div className="relative w-full h-full flex flex-col">
        <div className="w-full flex flex-wrap justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm border-b border-neongreen/20">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              <Coins className="w-4 h-4 mr-1" />
              Balance: {balance.toFixed(3)} SOL
            </Badge>
            <Badge variant="outline" className="bg-neongreen/20 text-neongreen border-neongreen">
              Total Winnings: {totalWinnings.toFixed(3)} SOL
            </Badge>
          </div>
          <Badge variant="outline" className="bg-harvestpeach/20 text-harvestpeach border-harvestpeach">
            Current Bet: {betAmount.toFixed(3)} SOL
          </Badge>
        </div>

        <div className="flex-1 w-full">
          <GameCanvas onSceneCreated={(scene) => gameSceneRef.current = scene} />
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