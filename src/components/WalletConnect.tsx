import React from 'react';
import { Button } from "@/components/ui/button";

interface WalletConnectProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
}

const WalletConnect = ({ onConnect, isConnected }: WalletConnectProps) => {
  const handleConnect = async () => {
    try {
      // For development, generate a mock wallet address
      const mockAddress = `wallet_${Math.random().toString(36).substring(2, 15)}`;
      onConnect(mockAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnected}
      className={`${
        isConnected 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-harvestorange hover:bg-harvestpeach'
      } text-white`}
    >
      {isConnected ? 'Connected' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnect;