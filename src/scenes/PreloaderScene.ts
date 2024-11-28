import Phaser from 'phaser';
import { LOADING_MESSAGES } from './constants/loadingMessages';

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private loadingText?: Phaser.GameObjects.Text;
  private cropCircle?: Phaser.GameObjects.Arc;
  private loadingComplete: boolean = false;
  private bgMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PreloaderScene' });
    console.log('PreloaderScene: Constructor initialized');
  }

  preload() {
    console.log('PreloaderScene: Starting preload');
    
    // Update background image to .WEBP format (matching case sensitivity)
    this.load.image('preloader-bg', '/images/neon-crop-circles.WEBP');
    
    // Load all audio assets
    const audioFiles = [
      { key: 'background-music', path: '/sounds/background-music.mp3' },
      { key: 'spin-sound', path: '/sounds/spin.mp3' },
      { key: 'win-sound', path: '/sounds/win.mp3' },
      { key: 'big-win-sound', path: '/sounds/big-win.mp3' },
      { key: 'lose-sound', path: '/sounds/lose.mp3' }
    ];

    audioFiles.forEach(audio => {
      console.log(`PreloaderScene: Loading audio - ${audio.key} from ${audio.path}`);
      this.load.audio(audio.key, audio.path);
    });
    
    // Create a white pixel for particles
    const whitePixel = this.make.graphics({ x: 0, y: 0 })
      .fillStyle(0xFFFFFF)
      .fillRect(0, 0, 2, 2);
    
    whitePixel.generateTexture('pixel', 2, 2);

    // Add loading event listeners
    this.load.on('complete', () => {
      console.log('PreloaderScene: All assets loaded successfully');
      this.initializeBackgroundMusic();
    });

    this.load.on('loaderror', (fileObj: any) => {
      console.error('PreloaderScene: Error loading asset:', fileObj.key);
      if (fileObj.key.includes('sound')) {
        const altPath = `${window.location.origin}/sounds/${fileObj.key}.mp3`;
        console.log(`PreloaderScene: Attempting to load from alternative path: ${altPath}`);
        this.load.audio(fileObj.key, altPath);
      }
    });
  }

  private initializeBackgroundMusic() {
    try {
      if (!this.sound.get('background-music')) {
        console.log('PreloaderScene: Initializing background music');
        this.bgMusic = this.sound.add('background-music', {
          volume: 0.5,
          loop: true
        });

        // Handle audio unlock for browsers
        if (this.sound.locked) {
          console.log('PreloaderScene: Audio locked, waiting for user interaction');
          this.sound.once('unlocked', () => {
            this.startBackgroundMusic();
          });
        } else {
          this.startBackgroundMusic();
        }
      }
    } catch (error) {
      console.error('PreloaderScene: Error initializing background music:', error);
    }
  }

  private startBackgroundMusic() {
    if (this.bgMusic && !this.bgMusic.isPlaying) {
      this.bgMusic.play();
      console.log('PreloaderScene: Background music started successfully');
      
      // Store music reference in registry for access in other scenes
      this.registry.set('bgMusic', this.bgMusic);
      this.registry.set('audioLoaded', true);
    }
  }

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

    // Add background image
    const background = this.add.image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height);

    // Create main loading text with neon effect
    this.messageText = this.add.text(width / 2, height * 0.4, 'The Harvest Begins...', {
      fontFamily: 'Space Grotesk',
      fontSize: '32px',
      color: '#4AE54A',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setAlpha(0);

    // Create secondary loading message
    this.loadingText = this.add.text(width / 2, height * 0.5, '', {
      fontFamily: 'Space Grotesk',
      fontSize: '24px',
      color: '#FEC6A1',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    })
    .setOrigin(0.5)
    .setAlpha(0);

    // Animate texts
    this.tweens.add({
      targets: [this.messageText, this.loadingText],
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Cycle through loading messages
    this.time.addEvent({
      delay: 2000,
      callback: this.updateLoadingMessage,
      callbackScope: this,
      loop: true
    });

    // Add particles
    const particles = this.add.particles(0, 0, 'pixel', {
      x: width / 2,
      y: height / 2,
      lifespan: 3000,
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: true,
      quantity: 2,
      frequency: 50
    });

    // Transition to game after delay
    this.time.delayedCall(6000, () => {
      this.loadingComplete = true;
      console.log('PreloaderScene: Starting transition to SlotGameScene');
      this.game.events.emit('sceneComplete');
    });

    console.log('PreloaderScene: Scene setup complete');
  }

  private updateLoadingMessage() {
    if (this.loadingText && !this.loadingComplete) {
      const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      this.loadingText.setText(randomMessage);
    }
  }
}
