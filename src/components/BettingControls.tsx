import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, Coins, RotateCw, Volume2, VolumeX } from "lucide-react";
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';

interface BettingControlsProps {
  onSpin: () => void;
  helpButton: React.ReactNode;
}

const BettingControls: React.FC<BettingControlsProps> = observer(({
  onSpin,
  helpButton
}) => {
  const { gameStore } = useStore();
  
  console.log('BettingControls: Rendering with store state:', {
    balance: gameStore.balance,
    betAmount: gameStore.betAmount,
    isSpinning: gameStore.isSpinning,
    isAutoSpin: gameStore.isAutoSpin,
    isMuted: gameStore.isMuted
  });

  useEffect(() => {
    console.log('BettingControls: Component mounted');
    return () => console.log('BettingControls: Component unmounting');
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    console.log('BettingControls: Slider value changed:', value[0]);
    gameStore.setBetAmount(value[0]);
  }, [gameStore]);

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
                defaultValue={[gameStore.betAmount]}
                max={10000}
                min={100}
                step={100}
                value={[gameStore.betAmount]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
            <span className="text-neongreen font-space min-w-[80px] text-right">{gameStore.betAmount}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => gameStore.toggleMute()}
            className="bg-nightsky/50 border-neongreen"
          >
            {gameStore.isMuted ? (
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
            disabled={gameStore.isSpinning || gameStore.betAmount > gameStore.balance}
          >
            {gameStore.isSpinning ? (
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
              gameStore.isAutoSpin 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => gameStore.toggleAutoSpin()}
            disabled={gameStore.isSpinning || gameStore.betAmount > gameStore.balance}
          >
            <RotateCw className={`h-6 w-6 ${gameStore.isAutoSpin ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default BettingControls;