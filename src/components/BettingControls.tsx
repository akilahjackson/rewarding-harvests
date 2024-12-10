import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import BetAmountControl from './betting/BetAmountControl';
import GameControls from './betting/GameControls';
import SpinControls from './betting/SpinControls';

interface BettingControlsProps {
  onSpin: () => void;
  helpButton: React.ReactNode;
}

const BettingControls: React.FC<BettingControlsProps> = observer(({
  onSpin,
  helpButton
}) => {
  const { gameStore } = useStore();
  
  useEffect(() => {
    console.log('BettingControls: Component mounted');
    return () => console.log('BettingControls: Component unmounting');
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-nightsky/50 backdrop-blur-sm border-t border-neongreen/20 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/2 space-y-2">
          <BetAmountControl />
        </div>
        
        <div className="flex items-center gap-4">
          <GameControls helpButton={helpButton} />
          <SpinControls onSpin={onSpin} />
        </div>
      </div>
    </div>
  );
});

export default BettingControls;