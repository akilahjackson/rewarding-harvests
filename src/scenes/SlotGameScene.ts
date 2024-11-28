import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager | null = null;
  
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
    
    // Create particle system for crop circles
    this.particles = this.add.particles('flares');
    
    // Create multiple emitters for different effects
    this.particles.createEmitter({
      frame: 'blue',
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      lifespan: 4000,
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      frequency: 500,
    });

    // Crop circle effect emitter
    const cropCircleEmitter = this.particles.createEmitter({
      frame: 'green',
      x: width / 2,
      y: height / 2,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 3000,
      blendMode: 'ADD',
      frequency: 2000,
      quantity: 20,
    });

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

    // Create random crop circle effects
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        cropCircleEmitter.setPosition(x, y);
        cropCircleEmitter.explode(20);
      },
      loop: true
    });

    console.log('SlotGameScene: Grid creation complete');
  }

  update() {
    // Update particle effects and animations
    if (this.particles) {
      // Add any additional particle updates here
    }
  }
}