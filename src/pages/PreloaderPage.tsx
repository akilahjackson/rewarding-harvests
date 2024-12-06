import React, { useState } from 'react';
import Phaser from 'phaser';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import AuthForm from '@/components/auth/AuthForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const PreloaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  React.useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000',
      scene: [PreloaderScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    game.scene.start('PreloaderScene', {
      showAuthModal: () => setShowAuthModal(true),
    });

    return () => game.destroy(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-nightsky">
      <div id="game-container" className="absolute inset-0" />

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-neongreen">Login to Play</DialogTitle>
          </DialogHeader>
          <AuthForm
            onSuccess={() => {
              setShowAuthModal(false);
              navigate('/welcome');
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreloaderPage;
