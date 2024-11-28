import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  preload() {
    // Preload particle assets
    this.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json');
  }

  create() {
    console.log('SlotGameScene: Creating slot game grid');
    const { width, height } = this.cameras.main;
    
    // Create particle emitter for ambient effects
    const particleManager = this.add.particles(0, 0, 'flares', {
      frame: ['blue', 'green'],
      lifespan: 4000,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      frequency: 500,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, width, height)
      }
    });
    
    this.particles = particleManager;

    // Calculate dynamic spacing
    const padding = Math.min(width, height) * 0.1;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    const cellSize = Math.min(
      availableWidth / this.GRID_SIZE,
      availableHeight / this.GRID_SIZE
    );
    
    const startX = (width - (cellSize * (this.GRID_SIZE - 1))) / 2;
    const startY = (height - (cellSize * (this.GRID_SIZE - 1))) / 2;
    
    const symbolTypes = ['🌾', '🌽', '🎃', '🍎', '🍇', '🥕'];

    // Create 6x6 grid with spread animation
    for (let row = 0; row < this.GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const randomSymbol = symbolTypes[Phaser.Math.Between(0, symbolTypes.length - 1)];
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        
        const symbol = this.add.text(x, y, randomSymbol, {
          fontSize: `${cellSize * 0.6}px`,
          padding: { x: cellSize * 0.15, y: cellSize * 0.15 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .setAlpha(0)
        .setScale(0.3);
        
        this.symbols[row][col] = symbol;
        
        // Add spread animation with delay based on position
        const delay = (row + col) * 100;
        this.tweens.add({
          targets: symbol,
          scale: 1,
          alpha: 1,
          y: y + 10,
          duration: 800,
          delay: delay,
          ease: 'Back.out',
          onComplete: () => {
            // Add floating animation after spread
            this.tweens.add({
              targets: symbol,
              y: y + 10,
              duration: 2000 + Math.random() * 1000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
        });
        
        // Add hover effects
        symbol.on('pointerover', () => {
          this.tweens.add({
            targets: symbol,
            scale: 1.1,
            duration: 100,
            ease: 'Power2'
          });
        });
        
        symbol.on('pointerout', () => {
          this.tweens.add({
            targets: symbol,
            scale: 1,
            duration: 100,
            ease: 'Power2'
          });
        });
      }
    }

    // Create random crop circle effects periodically
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        
        // Create a circular particle burst
        const burstEmitter = this.add.particles(x, y, 'flares', {
          frame: 'green',
          lifespan: 1000,
          speed: { min: 100, max: 200 },
          scale: { start: 0.2, end: 0 },
          alpha: { start: 0.5, end: 0 },
          blendMode: 'ADD',
          quantity: 20,
          emitZone: {
            type: 'random',
            source: new Phaser.Geom.Circle(0, 0, 50)
          }
        });

        // Stop emitting after burst
        this.time.delayedCall(100, () => {
          burstEmitter.stop();
        });
      },
      loop: true
    });

    console.log('SlotGameScene: Grid creation complete');
  }

  update() {
    // Update particle effects and animations if needed
    if (this.particles) {
      // Add any additional particle updates here if needed
    }
  }
}