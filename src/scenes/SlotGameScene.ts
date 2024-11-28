import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private isSpinning: boolean = false;
  private symbolTypes = ['🌾', '🌽', '🎃', '🍎', '🍇', '🥕'];
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  preload() {
    // Load particle effects for ambient background
    this.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json');
    console.log('SlotGameScene: Assets preloaded');
  }

  create() {
    console.log('SlotGameScene: Creating slot game grid');
    const { width, height } = this.cameras.main;
    
    // Initialize particle effects for ambient background
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
    console.log('Creating initial grid layout');
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

    // Create initial grid with symbols
    for (let row = 0; row < this.GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const randomSymbol = this.symbolTypes[Phaser.Math.Between(0, this.symbolTypes.length - 1)];
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
        
        // Add entrance animation for each symbol
        this.tweens.add({
          targets: symbol,
          scale: 1,
          alpha: 1,
          y: y + 10,
          duration: 800,
          delay: (row + col) * 100,
          ease: 'Back.out',
          onComplete: () => {
            // Add floating animation
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
    console.log('Grid creation completed');
  }

  public startSpin(betAmount: number, multiplier: number): Promise<number> {
    return new Promise((resolve) => {
      if (this.isSpinning) {
        console.log('Spin already in progress');
        return;
      }

      console.log(`Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
      this.isSpinning = true;

      // Stop all current animations
      this.symbols.flat().forEach(symbol => {
        this.tweens.killTweensOf(symbol);
      });

      // Spin animation for each symbol
      let completedSpins = 0;
      const totalSymbols = this.GRID_SIZE * this.GRID_SIZE;

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
              const newSymbol = this.symbolTypes[Phaser.Math.Between(0, this.symbolTypes.length - 1)];
              symbol.setText(newSymbol);

              // Spin in animation
              this.tweens.add({
                targets: symbol,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Back.out',
                onComplete: () => {
                  completedSpins++;
                  console.log(`Symbol spin completed: ${completedSpins}/${totalSymbols}`);

                  // Check if all symbols have completed spinning
                  if (completedSpins === totalSymbols) {
                    console.log('All symbols have completed spinning');
                    this.isSpinning = false;
                    const winAmount = this.calculateWinnings(betAmount, multiplier);
                    console.log(`Spin completed with win amount: ${winAmount}`);
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
    console.log('Calculating winnings...');
    
    // Count matching symbols in rows, columns, and diagonals
    let matches = this.countMatches();
    console.log(`Found ${matches} matching combinations`);

    if (matches > 0) {
      const winAmount = betAmount * multiplier * matches;
      console.log(`Win amount calculated: ${winAmount}`);
      return winAmount;
    }
    
    console.log('No winning combinations found');
    return 0;
  }

  private countMatches(): number {
    let totalMatches = 0;

    // Check rows
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE - 2; col++) {
        const symbol = this.symbols[row][col].text;
        if (symbol === this.symbols[row][col + 1].text &&
            symbol === this.symbols[row][col + 2].text) {
          totalMatches++;
          console.log(`Found horizontal match at row ${row}, column ${col}`);
        }
      }
    }

    // Check columns
    for (let col = 0; col < this.GRID_SIZE; col++) {
      for (let row = 0; row < this.GRID_SIZE - 2; row++) {
        const symbol = this.symbols[row][col].text;
        if (symbol === this.symbols[row + 1][col].text &&
            symbol === this.symbols[row + 2][col].text) {
          totalMatches++;
          console.log(`Found vertical match at row ${row}, column ${col}`);
        }
      }
    }

    return totalMatches;
  }
}