import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private readonly GRID_SIZE = 6;
  private readonly SYMBOL_SPACING = 80;
  private readonly SYMBOL_SCALE = 1.5;
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating slot game grid');
    const { width, height } = this.cameras.main;
    
    // Calculate grid positioning
    const startX = width / 2 - (this.GRID_SIZE * this.SYMBOL_SPACING) / 2 + this.SYMBOL_SPACING / 2;
    const startY = height / 2 - (this.GRID_SIZE * this.SYMBOL_SPACING) / 2 + this.SYMBOL_SPACING / 2;
    
    const symbolTypes = [
      '🌾', // wheat
      '🌽', // corn
      '🎃', // pumpkin
      '🍎', // apple
      '🍇', // grapes
      '🥕'  // carrot
    ];

    // Create 6x6 grid
    for (let row = 0; row < this.GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const randomSymbol = symbolTypes[Phaser.Math.Between(0, symbolTypes.length - 1)];
        const x = startX + col * this.SYMBOL_SPACING;
        const y = startY + row * this.SYMBOL_SPACING;
        
        const symbol = this.add.text(x, y, randomSymbol, {
          fontSize: '48px',
          backgroundColor: '#ffffff33',
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5)
        .setScale(this.SYMBOL_SCALE)
        .setInteractive();
        
        this.symbols[row][col] = symbol;
        
        // Add hover effect
        symbol.on('pointerover', () => {
          this.tweens.add({
            targets: symbol,
            scale: this.SYMBOL_SCALE * 1.1,
            duration: 100
          });
        });
        
        symbol.on('pointerout', () => {
          this.tweens.add({
            targets: symbol,
            scale: this.SYMBOL_SCALE,
            duration: 100
          });
        });
      }
    }

    console.log('SlotGameScene: Grid creation complete');
  }
}