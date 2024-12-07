import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, RotateCw, Volume2, VolumeX } from "lucide-react";

interface BettingControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (value: number) => void;
  totalWinnings: number;
  isSpinning: boolean;
  onSpin: () => void;
  isAutoSpin: boolean;
  onAutoSpinToggle: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  helpButton: React.ReactNode;
}

const BettingControls: React.FC<BettingControlsProps> = ({
  balance,
  betAmount,
  setBetAmount,
  totalWinnings,
  isSpinning,
  onSpin,
  isAutoSpin,
  onAutoSpinToggle,
  isMuted,
  onMuteToggle,
  helpButton
}) => {
  console.log('BettingControls: Rendering with props:', {
    balance,
    betAmount,
    isSpinning,
    isAutoSpin,
    isMuted
  });

  useEffect(() => {
    console.log('BettingControls: Component mounted');
    return () => console.log('BettingControls: Component unmounting');
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    console.log('BettingControls: Slider value changed:', value[0]);
    setBetAmount(value[0]);
  }, [setBetAmount]);

  const handleSpinClick = () => {
    console.log('BettingControls: Spin button clicked');
    onSpin();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-nightsky/50 backdrop-blur-sm border-t border-neongreen/20 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-neongreen font-space whitespace-nowrap min-w-[120px]">Bet (HRVST):</span>
            <div className="flex-1">
              <Slider
                defaultValue={[betAmount]}
                max={10000}
                min={100}
                step={100}
                value={[betAmount]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
            <span className="text-neongreen font-space min-w-[80px] text-right">{betAmount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onMuteToggle}
            className="bg-nightsky/50 border-neongreen"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-neongreen" />
            ) : (
              <Volume2 className="h-6 w-6 text-neongreen" />
            )}
          </Button>
          
          <div className="h-16 flex items-center">
            {helpButton}
          </div>

          <Button
            className="min-w-[200px] h-16 bg-neongreen text-nightsky hover:bg-neongreen/80 font-space text-lg"
            onClick={handleSpinClick}
            disabled={isSpinning || betAmount > balance}
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
            disabled={isSpinning || betAmount > balance}
          >
            <RotateCw className={`h-6 w-6 ${isAutoSpin ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BettingControls;