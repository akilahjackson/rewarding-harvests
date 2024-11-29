import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import Phaser from 'phaser';
import WalletConnect from '@/components/WalletConnect';
import { useToast } from "@/hooks/use-toast";

const PreloaderPage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
  const handleConnect = () => {
    console.log('PreloaderPage: Connecting wallet');
    // Simulating wallet connection for now
    setIsConnected(true);
    toast({
      title: "Wallet Connected",
      description: "You can now start playing!",
      duration: 2000,
    });
  };

  useEffect(() => {
    if (!isConnected) return;

    console.log('Initializing PreloaderPage');
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#000000',
      scene: [PreloaderScene, SlotGameScene]
    };

    try {
      console.log('PreloaderPage: Creating new Phaser game instance');
      const game = new Phaser.Game(config);

      const handleSceneComplete = () => {
        console.log('Preloader complete, navigating to game');
        game.destroy(true);
        navigate('/game');
      };

      game.events.on('sceneComplete', handleSceneComplete);

      return () => {
        game.events.off('sceneComplete', handleSceneComplete);
        game.destroy(true);
      };
    } catch (error) {
      console.error('PreloaderPage: Error creating Phaser game instance:', error);
    }
  }, [navigate, isConnected]);

  return (
    <div className="w-full min-h-screen bg-nightsky relative">
      <div id="game-container" className="w-full h-full" />
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Harvest Slots</h2>
            <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreloaderPage;