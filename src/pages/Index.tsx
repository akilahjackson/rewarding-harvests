import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GameCanvas from '@/components/GameCanvas';
import WalletConnect from '@/components/WalletConnect';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = React.useState(false);
  const isMobile = useIsMobile();

  const handleConnect = async () => {
    try {
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: "You can now start playing!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-nightsky text-white">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-neongreen animate-glow-pulse">
            Harvest Slots
          </h1>
          <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
        </header>
        
        <main className="flex flex-col items-center">
          <div className="w-full max-w-4xl aspect-video">
            <GameCanvas />
          </div>
          
          <div className="mt-4 md:mt-8 flex flex-wrap gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-harvestorange text-white hover:bg-harvestpeach w-full md:w-auto"
              disabled={!isConnected}
            >
              Spin
            </Button>
            <Button 
              variant="outline" 
              className="bg-neongreen text-white hover:opacity-80 w-full md:w-auto"
              disabled={!isConnected}
            >
              Auto Spin
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;