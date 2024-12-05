import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import { SlotGameScene } from '@/scenes/SlotGameScene';
import Phaser from 'phaser';
import { useToast } from "@/hooks/use-toast";

const PreloaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('PreloaderPage: Initializing game');
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

      // Pass navigation function to PreloaderScene
      game.scene.start('PreloaderScene', { 
        onWalletConnect: () => {
          console.log('PreloaderPage: Wallet connected from scene');
          setIsConnected(true);
          toast({
            title: "Wallet Connected",
            description: "You can now start playing!",
            duration: 2000,
          });
        },
        onLoginClick: () => {
          console.log('PreloaderPage: Login clicked, navigating to auth');
          game.destroy(true);
          navigate('/auth');
        }
      });

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
  }, [navigate, toast]);

  return (
    <div className="w-full min-h-screen bg-nightsky">
      <div id="game-container" className="w-full h-full" />
    </div>
  );
};

export default PreloaderPage;