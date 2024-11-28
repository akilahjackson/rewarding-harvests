import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating slot game grid');
    const { width, height } = this.cameras.main;
    
    // Calculate dynamic spacing to fill the container
    const padding = Math.min(width, height) * 0.1; // 10% padding
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    const cellSize = Math.min(
      availableWidth / this.GRID_SIZE,
      availableHeight / this.GRID_SIZE
    );
    
    // Calculate starting position to center the grid
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

    console.log('SlotGameScene: Grid creation complete');
  }
}