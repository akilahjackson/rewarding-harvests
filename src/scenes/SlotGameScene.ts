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
    
    // Calculate dynamic spacing based on screen size
    const minDimension = Math.min(width, height);
    const spacing = minDimension / (this.GRID_SIZE + 1); // Add 1 for padding
    const symbolSize = spacing * 0.8; // Symbol size slightly smaller than spacing
    
    // Calculate grid positioning
    const startX = (width - (spacing * (this.GRID_SIZE - 1))) / 2;
    const startY = (height - (spacing * (this.GRID_SIZE - 1))) / 2;
    
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
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        
        const symbol = this.add.text(x, y, randomSymbol, {
          fontSize: `${symbolSize}px`,
          backgroundColor: '#ffffff33',
          padding: { x: symbolSize * 0.2, y: symbolSize * 0.2 },
        })
        .setOrigin(0.5)
        .setInteractive();
        
        this.symbols[row][col] = symbol;
        
        // Add hover effect
        symbol.on('pointerover', () => {
          this.tweens.add({
            targets: symbol,
            scale: 1.1,
            duration: 100
          });
        });
        
        symbol.on('pointerout', () => {
          this.tweens.add({
            targets: symbol,
            scale: 1,
            duration: 100
          });
        });
      }
    }

    console.log('SlotGameScene: Grid creation complete');
  }
}