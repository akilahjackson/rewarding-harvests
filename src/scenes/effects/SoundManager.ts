import Phaser from 'phaser';

export class SoundManager {
  private scene: Phaser.Scene;
  private spinSound: Phaser.Sound.BaseSound;
  private winSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    console.log('SoundManager: Initializing');
    this.scene = scene;
    
    try {
      // Check if audio is loaded in registry
      const audioLoaded = this.scene.registry.get('audioLoaded');
      if (!audioLoaded) {
        console.error('SoundManager: Audio not preloaded in PreloaderScene');
      }
      
      this.spinSound = this.scene.sound.add('spin-sound', { volume: 0.5 });
      this.winSound = this.scene.sound.add('win-sound', { volume: 0.7 });
      console.log('SoundManager: Sound effects initialized successfully');
    } catch (error) {
      console.error('SoundManager: Error initializing sounds:', error);
      // Create dummy sound objects if loading fails
      this.spinSound = this.createDummySound();
      this.winSound = this.createDummySound();
    }
  }

  private createDummySound(): Phaser.Sound.BaseSound {
    return {
      play: () => {},
      stop: () => {},
      destroy: () => {},
    } as unknown as Phaser.Sound.BaseSound;
  }

  playSpinSound() {
    try {
      this.spinSound.play();
      console.log('SoundManager: Playing spin sound');
    } catch (error) {
      console.error('SoundManager: Error playing spin sound:', error);
    }
  }

  playWinSound() {
    try {
      this.winSound.play();
      console.log('SoundManager: Playing win sound');
    } catch (error) {
      console.error('SoundManager: Error playing win sound:', error);
    }
  }

  toggleMute(isMuted: boolean) {
    this.scene.sound.mute = isMuted;
    console.log('SoundManager: Mute toggled:', isMuted);
  }
}