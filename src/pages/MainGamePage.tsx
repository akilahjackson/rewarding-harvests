import React from 'react';
import GameCanvas from '@/components/GameCanvas';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

const MainGamePage = () => {
  const [betAmount, setBetAmount] = React.useState(1);
  const [isSpinning, setIsSpinning] = React.useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    // Add spin logic here
    setTimeout(() => setIsSpinning(false), 2000);
  };

  return (
    <div className="relative w-full h-screen bg-nightsky overflow-hidden">
      {/* Background wheat field image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center opacity-30" />
      
      {/* Game content */}
      <div className="relative w-full h-full flex flex-col items-center justify-between p-4">
        {/* Header with stats */}
        <div className="w-full flex justify-between items-center p-4 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          <div className="text-neongreen font-space">
            Balance: 1000
          </div>
          <div className="text-neongreen font-space">
            Win: 0
          </div>
        </div>

        {/* Main game area */}
        <div className="flex-1 w-full max-w-7xl my-4">
          <GameCanvas />
        </div>

        {/* Controls */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-transparent border-neongreen text-neongreen hover:bg-neongreen hover:text-nightsky"
              onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
            >
              -
            </Button>
            <span className="text-neongreen font-space min-w-[60px] text-center">
              {betAmount}
            </span>
            <Button
              variant="outline"
              className="bg-transparent border-neongreen text-neongreen hover:bg-neongreen hover:text-nightsky"
              onClick={() => setBetAmount(betAmount + 1)}
            >
              +
            </Button>
          </div>
          
          <Button
            className="min-w-[200px] bg-neongreen text-nightsky hover:bg-neongreen/80 font-space text-lg"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSpinning ? "Spinning..." : "SPIN"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainGamePage;