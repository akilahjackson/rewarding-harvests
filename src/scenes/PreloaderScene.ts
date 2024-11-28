import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private cropCircle?: Phaser.GameObjects.Arc;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private loadingComplete: boolean = false;

  constructor() {
    super({ key: 'PreloaderScene' });
    console.log('PreloaderScene: Constructor initialized');
  }

  preload() {
    console.log('PreloaderScene: Starting preload');
    
    // Create a white pixel for particles
    const whitePixel = this.make.graphics({ x: 0, y: 0, add: false })
      .fillStyle(0xFFFFFF)
      .fillRect(0, 0, 2, 2)
      .generateTexture('pixel', 2, 2);
  }

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

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
          this.game.events.emit('sceneComplete');
        }, 2000);
      }
    });

    // Create neon text
    this.messageText = this.add.text(width / 2, height * 0.75, 'The Harvest Begins...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#39ff14',
      align: 'center'
    })
    .setOrigin(0.5)
    .setPipeline('Light2D');

    // Add text glow effect
    const light = this.lights.addLight(0, 0, 200, 0x39ff14, 1);
    this.lights.enable().setAmbientColor(0x000000);
    
    // Create particle emitters
    const particlePositions = [
      { x: width * 0.5, y: height * 0.5 },
      { x: width * 0.55, y: height * 0.45 },
      { x: width * 0.6, y: height * 0.4 }
    ];

    particlePositions.forEach((pos, index) => {
      const emitter = this.add.particles(pos.x, pos.y, 'pixel', {
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.6, end: 0 },
        speed: 100,
        angle: { min: 0, max: 360 },
        lifespan: 3000,
        frequency: 100,
        quantity: 1,
        blendMode: 'ADD',
        tint: 0xff00ff
      });
      this.particles.push(emitter);
    });

    // Add text fade animation
    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    console.log('PreloaderScene: Scene setup complete');
  }
}