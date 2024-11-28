import Phaser from 'phaser';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Image[][] = [];
  private readonly GRID_SIZE = 6;
  private readonly SYMBOL_SPACING = 80;
  
  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  preload() {
    console.log('SlotGameScene: Loading harvest symbols');
    // Load harvest-themed symbols
    this.load.image('harvest-corn', 'https://placekitten.com/80/80'); // Temporary placeholder
    this.load.image('harvest-wheat', 'https://placekitten.com/81/81'); // Temporary placeholder
    this.load.image('harvest-apple', 'https://placekitten.com/82/82'); // Temporary placeholder
    this.load.image('harvest-pumpkin', 'https://placekitten.com/83/83'); // Temporary placeholder
    this.load.image('harvest-grape', 'https://placekitten.com/84/84'); // Temporary placeholder
    this.load.image('harvest-carrot', 'https://placekitten.com/85/85'); // Temporary placeholder
  }

  create() {
    console.log('SlotGameScene: Creating slot game grid');
    const { width, height } = this.cameras.main;
    
    // Calculate grid positioning
    const startX = width / 2 - (this.GRID_SIZE * this.SYMBOL_SPACING) / 2 + this.SYMBOL_SPACING / 2;
    const startY = height / 2 - (this.GRID_SIZE * this.SYMBOL_SPACING) / 2 + this.SYMBOL_SPACING / 2;
    
    const symbolTypes = [
      'harvest-corn',
      'harvest-wheat',
      'harvest-apple',
      'harvest-pumpkin',
      'harvest-grape',
      'harvest-carrot'
    ];

    // Create 6x6 grid
    for (let row = 0; row < this.GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const randomSymbol = symbolTypes[Phaser.Math.Between(0, symbolTypes.length - 1)];
        const x = startX + col * this.SYMBOL_SPACING;
        const y = startY + row * this.SYMBOL_SPACING;
        
        const symbol = this.add.image(x, y, randomSymbol)
          .setScale(0.8)
          .setInteractive();
        
        this.symbols[row][col] = symbol;
        
        // Add hover effect
        symbol.on('pointerover', () => {
          this.tweens.add({
            targets: symbol,
            scale: 0.9,
            duration: 100
          });
        });
        
        symbol.on('pointerout', () => {
          this.tweens.add({
            targets: symbol,
            scale: 0.8,
            duration: 100
          });
        });
      }
    }

    console.log('SlotGameScene: Grid creation complete');
  }
}