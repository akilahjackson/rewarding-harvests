import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from "lucide-react";
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';

interface GameControlsProps {
  helpButton: React.ReactNode;
}

const GameControls = observer(({ helpButton }: GameControlsProps) => {
  const { gameStore } = useStore();

  return (
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
    </div>
  );
});

export default GameControls;