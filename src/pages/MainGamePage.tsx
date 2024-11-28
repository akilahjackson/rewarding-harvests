import React from 'react';
import GameCanvas from '@/components/GameCanvas';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MainGamePage = () => {
  const [betAmount, setBetAmount] = React.useState(10);
  const [multiplier, setMultiplier] = React.useState(1);
  const [totalWinnings, setTotalWinnings] = React.useState(0);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const { toast } = useToast();

  const handleMultiplierChange = (value: number[]) => {
    setMultiplier(value[0]);
    console.log('Multiplier changed:', value[0]);
  };

  const calculateTotalBet = () => {
    return betAmount * multiplier;
  };

  const handleSpin = () => {
    setIsSpinning(true);
    const totalBet = calculateTotalBet();
    console.log('Starting spin with bet:', totalBet);
    
    // Simulate a spin result (replace with actual game logic)
    setTimeout(() => {
      const win = Math.random() > 0.5 ? totalBet * 2 : 0;
      setTotalWinnings(prev => prev + win);
      
      toast({
        title: win > 0 ? "Winner!" : "Try Again!",
        description: win > 0 ? `You won ${win} coins!` : "Better luck next time!",
        variant: win > 0 ? "default" : "destructive",
      });
      
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      {/* Background wheat field image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center opacity-30" />
      
      {/* Game content */}
      <div className="relative w-full h-full flex flex-col items-center justify-between p-4 gap-4">
        {/* Header with stats */}
        <div className="w-full max-w-7xl flex justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          <div className="flex gap-4">
            <Badge variant="outline" className="bg-harvestorange/20 text-harvestorange border-harvestorange">
              Balance: 1000
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
          <GameCanvas />
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
          
          {/* Spin button */}
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
        </div>
      </div>
    </div>
  );
};

export default MainGamePage;