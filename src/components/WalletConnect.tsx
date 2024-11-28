import React from 'react';
import { Button } from "@/components/ui/button";

interface WalletConnectProps {
  onConnect: () => void;
  isConnected: boolean;
}

const WalletConnect = ({ onConnect, isConnected }: WalletConnectProps) => {
  return (
    <Button
      onClick={onConnect}
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