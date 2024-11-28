import Phaser from 'phaser';

export class SoundManager {
  private scene: Phaser.Scene;
  private spinSound: Phaser.Sound.BaseSound;
  private winSound: Phaser.Sound.BaseSound;
  private loseSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    console.log('SoundManager: Initializing');
    this.scene = scene;
    
    try {
      const audioLoaded = this.scene.registry.get('audioLoaded');
      if (!audioLoaded) {
        console.warn('SoundManager: Audio not preloaded in PreloaderScene, attempting to load now');
        this.loadSoundEffects();
      } else {
        this.initializeSounds();
      }
    } catch (error) {
      console.error('SoundManager: Error in constructor:', error);
      this.spinSound = this.createDummySound();
      this.winSound = this.createDummySound();
      this.loseSound = this.createDummySound();
    }
  }

  private loadSoundEffects() {
    try {
      this.scene.load.audio('spin-sound', '/sounds/spin.mp3');
      this.scene.load.audio('win-sound', '/sounds/win.mp3');
      this.scene.load.audio('lose-sound', '/sounds/lose.mp3');
      this.scene.load.once('complete', () => {
        console.log('SoundManager: Sound effects loaded successfully');
        this.initializeSounds();
      });
      this.scene.load.start();
    } catch (error) {
      console.error('SoundManager: Error loading sound effects:', error);
    }
  }

  private initializeSounds() {
    try {
      this.spinSound = this.scene.sound.add('spin-sound', { volume: 0.5 });
      this.winSound = this.scene.sound.add('win-sound', { volume: 0.7 });
      this.loseSound = this.scene.sound.add('lose-sound', { volume: 0.5 });
      console.log('SoundManager: Sounds initialized successfully');
    } catch (error) {
      console.error('SoundManager: Error initializing sounds:', error);
      this.spinSound = this.createDummySound();
      this.winSound = this.createDummySound();
      this.loseSound = this.createDummySound();
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
      if (this.scene.sound.locked) {
        console.log('SoundManager: Audio locked, waiting for unlock');
        this.scene.sound.once('unlocked', () => {
          this.spinSound.play();
        });
      } else {
        this.spinSound.play();
        console.log('SoundManager: Playing spin sound');
      }
    } catch (error) {
      console.error('SoundManager: Error playing spin sound:', error);
    }
  }

  playWinSound() {
    try {
      if (this.scene.sound.locked) {
        console.log('SoundManager: Audio locked, waiting for unlock');
        this.scene.sound.once('unlocked', () => {
          this.winSound.play();
        });
      } else {
        this.winSound.play();
        console.log('SoundManager: Playing win sound');
      }
    } catch (error) {
      console.error('SoundManager: Error playing win sound:', error);
    }
  }

  playLoseSound() {
    try {
      if (this.scene.sound.locked) {
        console.log('SoundManager: Audio locked, waiting for unlock');
        this.scene.sound.once('unlocked', () => {
          this.loseSound.play();
        });
      } else {
        this.loseSound.play();
        console.log('SoundManager: Playing lose sound');
      }
    } catch (error) {
      console.error('SoundManager: Error playing lose sound:', error);
    }
  }

  toggleMute(isMuted: boolean) {
    this.scene.sound.mute = isMuted;
    console.log('SoundManager: Mute toggled:', isMuted);
  }
}