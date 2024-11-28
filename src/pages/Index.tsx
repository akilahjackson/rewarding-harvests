import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GameCanvas from '@/components/GameCanvas';
import WalletConnect from '@/components/WalletConnect';

const Index = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = React.useState(false);

  const handleConnect = async () => {
    try {
      // Web3 connection logic will go here
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
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neongreen animate-glow-pulse">
            Harvest Slots
          </h1>
          <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
        </header>
        
        <main className="flex flex-col items-center">
          <GameCanvas />
          
          <div className="mt-8 flex gap-4">
            <Button 
              variant="outline" 
              className="bg-harvestorange text-white hover:bg-harvestpeach"
              disabled={!isConnected}
            >
              Spin
            </Button>
            <Button 
              variant="outline" 
              className="bg-neongreen text-white hover:opacity-80"
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