import React, { useState, useEffect } from 'react';
import Phaser from 'phaser';
import { PreloaderScene } from '@/scenes/PreloaderScene';
import AuthForm from '@/components/AuthForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const PreloaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // If user is already authenticated, redirect to welcome page
    if (user?.isAuthenticated) {
      console.log('PreloaderPage: User is authenticated, redirecting to welcome page');
      navigate('/welcome');
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#1A1F2C',
      scene: PreloaderScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      audio: {
        disableWebAudio: false
      }
    };

    console.log('PreloaderPage: Initializing game');
    const game = new Phaser.Game(config);

    game.scene.start('PreloaderScene', {
      showAuthModal: () => {
        console.log('PreloaderPage: Showing auth modal');
        setShowAuthModal(true);
      }
    });

    return () => {
      console.log('PreloaderPage: Cleaning up game instance');
      game.destroy(true);
    };
  }, [navigate, user]);

  const handleAuthSuccess = () => {
    console.log('PreloaderPage: Auth successful, navigating to welcome');
    setShowAuthModal(false);
    navigate('/welcome', { replace: true }); // Using replace to prevent going back to preloader
  };

  return (
    <div className="relative w-full h-screen bg-nightsky">
      <div id="game-container" className="absolute inset-0" />

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-transparent border-none shadow-none">
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreloaderPage;