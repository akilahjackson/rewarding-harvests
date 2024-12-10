import React from 'react';
import { Slider } from '@/components/ui/slider';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';

const BetAmountControl = observer(() => {
  const { gameStore } = useStore();

  const handleSliderChange = (value: number[]) => {
    console.log('BetAmountControl: Slider value changed:', value[0]);
    gameStore.setBetAmount(value[0]);
  };

  return (
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
  );
});

export default BetAmountControl;