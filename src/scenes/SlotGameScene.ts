import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private isSpinning: boolean = false;
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  preload() {
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

    this.createGrid();
  }

  private createGrid() {
    const { width, height } = this.cameras.main;
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
        
        this.tweens.add({
          targets: symbol,
          scale: 1,
          alpha: 1,
          y: y + 10,
          duration: 800,
          delay: (row + col) * 100,
          ease: 'Back.out',
          onComplete: () => {
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
      }
    }
  }

  public startSpin(betAmount: number, multiplier: number): Promise<number> {
    return new Promise((resolve) => {
      if (this.isSpinning) return;
      this.isSpinning = true;
      console.log(`Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);

      // Stop all current animations
      this.symbols.flat().forEach(symbol => {
        this.tweens.killTweensOf(symbol);
      });

      // Spin animation
      const spinDuration = 2000;
      const symbolTypes = ['🌾', '🌽', '🎃', '🍎', '🍇', '🥕'];

      this.symbols.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
          // Spin out animation
          this.tweens.add({
            targets: symbol,
            scale: 0,
            alpha: 0,
            duration: 300,
            delay: (rowIndex + colIndex) * 50,
            onComplete: () => {
              // Change symbol
              const newSymbol = symbolTypes[Phaser.Math.Between(0, symbolTypes.length - 1)];
              symbol.setText(newSymbol);

              // Spin in animation
              this.tweens.add({
                targets: symbol,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Back.out',
                onComplete: () => {
                  if (rowIndex === this.GRID_SIZE - 1 && colIndex === this.GRID_SIZE - 1) {
                    this.isSpinning = false;
                    const winAmount = this.calculateWinnings(betAmount, multiplier);
                    resolve(winAmount);
                  }
                }
              });
            }
          });
        });
      });
    });
  }

  private calculateWinnings(betAmount: number, multiplier: number): number {
    // Simple random win calculation - replace with actual win logic
    const randomWin = Math.random();
    if (randomWin > 0.7) {
      return betAmount * multiplier * (Math.floor(randomWin * 5) + 1);
    }
    return 0;
  }
}