import Phaser from 'phaser';
import { LOADING_MESSAGES } from './constants/loadingMessages';

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private loadingText?: Phaser.GameObjects.Text;
  private cropCircle?: Phaser.GameObjects.Arc;
  private loadingComplete: boolean = false;
  private bgMusic?: Phaser.Sound.BaseSound;
  private bgImage?: Phaser.GameObjects.Image;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  private clickText?: Phaser.GameObjects.Text;

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

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

    // Add background image with animation
    this.bgImage = this.add.image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height);

    // Add floating animation to background
    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Update particle creation to use the correct type
    this.particles = this.add.particles(0, 0, 'pixel', {
      frame: 0,
      quantity: 2,
      frequency: 500,
      scale: { start: 0.05, end: 0 },
      alpha: { start: 0.3, end: 0 },
      speed: { min: 50, max: 100 },
      lifespan: 3000,
      blendMode: Phaser.BlendModes.ADD
    });

    // Create main loading text with neon effect
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

    // Create secondary loading message
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

    // Add click to start text if audio is locked
    if (this.sound.locked) {
      this.clickText = this.add.text(width / 2, height * 0.6, 'Click/Tap to Start', {
        fontFamily: 'Space Grotesk',
        fontSize: Math.min(width * 0.04, 24) + 'px',
        color: '#FFFFFF',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0);

      // Fade in click text
      this.tweens.add({
        targets: this.clickText,
        alpha: 1,
        duration: 1000,
        ease: 'Power2'
      });

      // Make the entire scene clickable
      this.input.on('pointerdown', () => {
        console.log('PreloaderScene: User interaction detected, attempting to unlock audio');
        this.startBackgroundMusic();
        if (this.clickText) {
          this.clickText.destroy();
        }
      });
    } else {
      this.startBackgroundMusic();
    }

    // Add glow effects and animations
    const glowFX = this.messageText.preFX?.addGlow(0x4AE54A, 0, 0, false, 0.1, 16);
    const loadingGlowFX = this.loadingText.preFX?.addGlow(0xFEC6A1, 0, 0, false, 0.1, 16);

    // Animate texts
    this.tweens.add({
      targets: [this.messageText, this.loadingText],
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Add pulsing circle animation
    const circle = this.add.circle(width / 2, height * 0.45, 100, 0x4AE54A, 0.2);
    this.tweens.add({
      targets: circle,
      scale: 1.2,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Cycle through loading messages
    this.time.addEvent({
      delay: 2000,
      callback: this.updateLoadingMessage,
      callbackScope: this,
      loop: true
    });

    // Initialize background music
    this.initializeBackgroundMusic();

    // Add resize listener
    this.scale.on('resize', this.handleResize, this);

    // Transition to game after delay only if music is playing or failed to load
    this.time.delayedCall(6000, () => {
      if (this.bgMusic?.isPlaying || !this.bgMusic) {
        this.loadingComplete = true;
        console.log('PreloaderScene: Starting transition to SlotGameScene');
        this.game.events.emit('sceneComplete');
      }
    });

    console.log('PreloaderScene: Scene setup complete');
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Update background image size
    if (this.bgImage) {
      this.bgImage.setDisplaySize(width, height)
        .setPosition(width / 2, height / 2);
    }

    // Update text positions and sizes
    if (this.messageText) {
      this.messageText
        .setPosition(width / 2, height * 0.4)
        .setFontSize(Math.min(width * 0.05, 32));
    }

    if (this.loadingText) {
      this.loadingText
        .setPosition(width / 2, height * 0.5)
        .setFontSize(Math.min(width * 0.04, 24));
    }
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
      }
    } catch (error) {
      console.error('PreloaderScene: Error initializing background music:', error);
    }
  }

  private startBackgroundMusic() {
    if (this.bgMusic && !this.bgMusic.isPlaying) {
      console.log('PreloaderScene: Attempting to start background music');
      this.bgMusic.play();
      console.log('PreloaderScene: Background music started successfully');
      
      // Store music reference in registry for access in other scenes
      this.registry.set('bgMusic', this.bgMusic);
      this.registry.set('audioLoaded', true);
    }
  }
}