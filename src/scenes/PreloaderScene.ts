import Phaser from 'phaser';
import { LOADING_MESSAGES } from './constants/loadingMessages';

interface PreloaderSceneData {
  onWalletConnect?: () => void;
}

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private loadingText?: Phaser.GameObjects.Text;
  private cropCircle?: Phaser.GameObjects.Arc;
  private loadingComplete: boolean = false;
  private bgMusic?: Phaser.Sound.BaseSound;
  private bgImage?: Phaser.GameObjects.Image;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  private connectButton?: Phaser.GameObjects.Text;
  private onWalletConnect?: () => void;

  constructor() {
    super({ key: 'PreloaderScene' });
    console.log('PreloaderScene: Constructor initialized');
  }

  init(data: PreloaderSceneData) {
    console.log('PreloaderScene: Initializing with data:', data);
    this.onWalletConnect = data.onWalletConnect;
  }

  preload() {
    console.log('PreloaderScene: Starting preload');
    this.load.image('preloader-bg', '/images/neon-crop-circles.WEBP');
    
    const audioFiles = [
      { key: 'background-music', path: '/sounds/background-music.mp3' },
      { key: 'spin-sound', path: '/sounds/spin.mp3' },
      { key: 'win-sound', path: '/sounds/win.mp3' },
      { key: 'big-win-sound', path: '/sounds/big-win.mp3' },
      { key: 'lose-sound', path: '/sounds/lose.mp3' }
    ];

    audioFiles.forEach(audio => {
      console.log(`PreloaderScene: Loading audio - ${audio.key}`);
      this.load.audio(audio.key, audio.path);
    });
    
    this.load.on('complete', () => {
      console.log('PreloaderScene: All assets loaded successfully');
      this.initializeBackgroundMusic();
    });
  }

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

    this.bgImage = this.add.image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height);

    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.messageText = this.add.text(width / 2, height * 0.4, 'The Harvest Begins...', {
      fontFamily: 'Space Grotesk',
      fontSize: Math.min(width * 0.05, 32) + 'px',
      color: '#4AE54A',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setAlpha(0);

    this.loadingText = this.add.text(width / 2, height * 0.5, '', {
      fontFamily: 'Space Grotesk',
      fontSize: Math.min(width * 0.04, 24) + 'px',
      color: '#FEC6A1',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    })
    .setOrigin(0.5)
    .setAlpha(0);

    // Create connect wallet button
    this.connectButton = this.add.text(width / 2, height * 0.6, 'Connect Wallet', {
      fontFamily: 'Space Grotesk',
      fontSize: Math.min(width * 0.04, 24) + 'px',
      color: '#FFFFFF',
      backgroundColor: '#FF6B35',
      padding: { x: 20, y: 10 },
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      console.log('PreloaderScene: Connect wallet button clicked');
      if (this.onWalletConnect) {
        this.onWalletConnect();
        this.connectButton?.setBackgroundColor('#4AE54A');
        this.connectButton?.setText('Connected');
        this.startBackgroundMusic();
      }
    });

    // Fade in texts
    this.tweens.add({
      targets: [this.messageText, this.loadingText, this.connectButton],
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Update loading messages
    this.time.addEvent({
      delay: 2000,
      callback: this.updateLoadingMessage,
      callbackScope: this,
      loop: true
    });

    this.initializeBackgroundMusic();
  }

  private updateLoadingMessage() {
    if (this.loadingText && !this.loadingComplete) {
      const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      this.loadingText.setText(randomMessage);
    }
  }

  private initializeBackgroundMusic() {
    try {
      if (!this.sound.get('background-music')) {
        console.log('PreloaderScene: Initializing background music');
        this.bgMusic = this.sound.add('background-music', {
          volume: 0.5,
          loop: true
        });
        // Store music reference in registry so other scenes can access it
        this.game.registry.set('bgMusic', this.bgMusic);
      }
    } catch (error) {
      console.error('PreloaderScene: Error initializing background music:', error);
    }
  }

  private startBackgroundMusic() {
    if (this.bgMusic && !this.bgMusic.isPlaying) {
      console.log('PreloaderScene: Starting background music');
      this.bgMusic.play();
      this.game.registry.set('audioLoaded', true);
      
      // Don't stop music when transitioning scenes
      this.events.on('shutdown', () => {
        if (this.bgMusic && this.bgMusic.isPlaying) {
          this.game.registry.set('bgMusicPlaying', true);
        }
      });
      
      // Transition to game after wallet connection
      this.time.delayedCall(2000, () => {
        this.loadingComplete = true;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          console.log('PreloaderScene: Starting transition to SlotGameScene');
          this.game.events.emit('sceneComplete');
        });
      });
    }
  }
}
