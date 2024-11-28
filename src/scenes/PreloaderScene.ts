import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private cropCircle?: Phaser.GameObjects.Arc;
  private loadingComplete: boolean = false;
  private bgMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PreloaderScene' });
    console.log('PreloaderScene: Constructor initialized');
  }

  preload() {
    console.log('PreloaderScene: Starting preload');
    
    // Load all audio assets
    this.load.audio('background-music', '/sounds/background-music.mp3');
    this.load.audio('spin-sound', '/sounds/spin.mp3');
    this.load.audio('win-sound', '/sounds/win.mp3');
    
    // Create a white pixel for particles
    const whitePixel = this.make.graphics({ x: 0, y: 0 })
      .fillStyle(0xFFFFFF)
      .fillRect(0, 0, 2, 2);
    
    whitePixel.generateTexture('pixel', 2, 2);

    // Add loading event listeners
    this.load.on('complete', () => {
      console.log('PreloaderScene: All assets loaded successfully');
    });

    this.load.on('loaderror', (fileObj: any) => {
      console.error('PreloaderScene: Error loading asset:', fileObj.key);
    });
  }

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

    // Start background music
    try {
      this.bgMusic = this.sound.add('background-music', {
        volume: 0.5,
        loop: true
      });
      this.bgMusic.play();
      console.log('PreloaderScene: Background music started');
      
      // Store music reference in registry for access in other scenes
      this.registry.set('bgMusic', this.bgMusic);
    } catch (error) {
      console.error('PreloaderScene: Error starting background music:', error);
    }

    // Create the crop circle
    this.cropCircle = this.add.circle(width / 2, height / 2, 128, 0x000000, 0)
      .setStrokeStyle(3, 0x39ff14);
    
    // Animate the crop circle
    this.tweens.add({
      targets: this.cropCircle,
      scale: { from: 0, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 5000,
      ease: 'Linear',
      onComplete: () => {
        setTimeout(() => {
          this.loadingComplete = true;
          console.log('PreloaderScene: Starting transition to SlotGameScene');
          // Store loaded audio cache in registry for other scenes
          this.registry.set('audioLoaded', true);
          this.game.events.emit('sceneComplete');
        }, 2000);
      }
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

    console.log('PreloaderScene: Scene setup complete');
  }
}