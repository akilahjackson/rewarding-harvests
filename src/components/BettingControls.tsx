import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, RotateCw } from "lucide-react";

interface BettingControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (value: number) => void;
  multiplier: number;
  setMultiplier: (value: number) => void;
  totalWinnings: number;
  isSpinning: boolean;
  onSpin: () => void;
  isAutoSpin: boolean;
  onAutoSpinToggle: () => void;
}

const BettingControls: React.FC<BettingControlsProps> = ({
  balance,
  betAmount,
  setBetAmount,
  multiplier,
  setMultiplier,
  totalWinnings,
  isSpinning,
  onSpin,
  isAutoSpin,
  onAutoSpinToggle
}) => {
  const calculateTotalBet = () => betAmount * multiplier;

  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-nightsky/50 backdrop-blur-sm rounded-xl border border-neongreen/20">
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
              onValueChange={(value) => setMultiplier(value[0])}
              className="w-full"
            />
          </div>
          <span className="text-neongreen font-space min-w-[4rem]">{multiplier}x</span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button
          className="min-w-[200px] h-16 bg-neongreen text-nightsky hover:bg-neongreen/80 font-space text-lg"
          onClick={onSpin}
          disabled={isSpinning || calculateTotalBet() > balance}
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
          onClick={onAutoSpinToggle}
          disabled={isSpinning || calculateTotalBet() > balance}
        >
          <RotateCw className={`h-6 w-6 ${isAutoSpin ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default BettingControls;