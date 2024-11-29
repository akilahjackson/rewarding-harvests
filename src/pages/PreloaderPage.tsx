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
    setIsConnected(true);
    toast({
      title: "Wallet Connected",
      description: "You can now start playing!",
      duration: 2000,
    });
  };

  useEffect(() => {
    if (!isConnected) return;

    console.log('PreloaderPage: Initializing game after wallet connection');
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
        console.log('PreloaderPage: Preloader complete, navigating to game');
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
    <div className="w-full min-h-screen bg-nightsky relative flex items-center justify-center">
      <div id="game-container" className="w-full h-full absolute inset-0" />
      <div className="relative z-10">
        <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
      </div>
    </div>
  );
};

export default PreloaderPage;