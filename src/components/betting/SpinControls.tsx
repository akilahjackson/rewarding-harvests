import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw } from "lucide-react";
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';

interface SpinControlsProps {
  onSpin: () => void;
}

const SpinControls = observer(({ onSpin }: SpinControlsProps) => {
  const { gameStore } = useStore();

  return (
    <div className="flex items-center gap-4">
      <Button
        className="min-w-[200px] h-16 bg-neongreen text-nightsky hover:bg-neongreen/80 font-space text-lg"
        onClick={onSpin}
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
  );
});

export default SpinControls;