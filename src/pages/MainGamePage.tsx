import React, { useRef, useState } from 'react';
import GameCanvas from '@/components/GameCanvas';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SlotGameScene } from '@/scenes/SlotGameScene';

const MainGamePage = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = React.useState(10);
  const [multiplier, setMultiplier] = React.useState(1);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const gameSceneRef = useRef<SlotGameScene | null>(null);
  const { toast } = useToast();

  const handleMultiplierChange = (value: number[]) => {
    setMultiplier(value[0]);
    console.log('Multiplier changed:', value[0]);
  };

  const calculateTotalBet = () => {
    return betAmount * multiplier;
  };

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
            description: `You won ${winAmount} coins!`,
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

  const toggleAutoSpin = () => {
    setIsAutoSpin(!isAutoSpin);
  };

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      {/* Background wheat field image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center opacity-30" />
      
      {/* Game content */}
      <div className="relative w-full h-full flex flex-col items-center justify-between p-4 gap-4">
        {/* Header with stats */}
        <div className="w-full max-w-7xl flex flex-wrap justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              <Coins className="w-4 h-4 mr-1" />
              Balance: {balance}
            </Badge>
            <Badge variant="outline" className="bg-neongreen/20 text-neongreen border-neongreen">
              Total Winnings: {totalWinnings}
            </Badge>
          </div>
          <Badge variant="outline" className="bg-harvestpeach/20 text-harvestpeach border-harvestpeach">
            Current Bet: {calculateTotalBet()}
          </Badge>
        </div>

        {/* Main game area */}
        <div className="flex-1 w-full max-w-7xl">
          <GameCanvas onSceneCreated={(scene) => gameSceneRef.current = scene} />
        </div>

        {/* Controls */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          {/* Betting controls */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-neongreen font-space whitespace-nowrap">Base Bet:</span>
              <div className="flex-1">
                <Slider
                  defaultValue={[10]}
                  max={100}
                  min={10}
                  step={10}
                  value={[betAmount]}
                  onValueChange={(value) => setBetAmount(value[0])}
                  className="w-full"
                />
              </div>
              <span className="text-neongreen font-space min-w-[4rem]">{betAmount}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-neongreen font-space whitespace-nowrap">Multiplier:</span>
              <div className="flex-1">
                <Slider
                  defaultValue={[1]}
                  max={10}
                  min={1}
                  step={1}
                  value={[multiplier]}
                  onValueChange={handleMultiplierChange}
                  className="w-full"
                />
              </div>
              <span className="text-neongreen font-space min-w-[4rem]">{multiplier}x</span>
            </div>
          </div>
          
          {/* Spin buttons */}
          <div className="flex gap-4">
            <Button
              className="min-w-[200px] h-16 bg-neongreen text-nightsky hover:bg-neongreen/80 font-space text-lg"
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Spinning...
                </>
              ) : (
                'SPIN'
              )}
            </Button>
            
            <Button
              className={`h-16 px-6 font-space ${
                isAutoSpin 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={toggleAutoSpin}
              disabled={isSpinning}
            >
              <RotateCw className={`h-6 w-6 ${isAutoSpin ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGamePage;