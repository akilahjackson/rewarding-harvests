import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game grid');
    this.currentGrid = createInitialGrid();
    this.createGrid();
  }

  private createGrid() {
    const { width, height } = this.cameras.main;
    const padding = Math.min(width, height) * 0.1;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    const cellSize = Math.min(
      availableWidth / GRID_SIZE,
      availableHeight / GRID_SIZE
    );

    const startX = (width - (cellSize * (GRID_SIZE - 1))) / 2;
    const startY = (height - (cellSize * (GRID_SIZE - 1))) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        
        const symbol = this.add.text(x, y, this.currentGrid[row][col], {
          fontSize: `${cellSize * 0.6}px`,
          padding: { x: cellSize * 0.15, y: cellSize * 0.15 },
        })
        .setOrigin(0.5)
        .setInteractive();
        
        this.symbols[row][col] = symbol;
        
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
    }
  }

  public async startSpin(betAmount: number, multiplier: number): Promise<number> {
    if (this.isSpinning) {
      console.log('Spin already in progress');
      return 0;
    }

    console.log(`Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;

    // Stop all current animations
    this.symbols.flat().forEach(symbol => {
      this.tweens.killTweensOf(symbol);
    });

    // Spin animation
    await this.animateSpinSequence();

    // Update grid with new symbols
    this.currentGrid = createInitialGrid();
    
    // Update symbols with new values
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        this.symbols[row][col].setText(this.currentGrid[row][col]);
      }
    }

    // Calculate winnings
    const winAmount = calculateWinnings(this.currentGrid, betAmount, multiplier);
    
    // Restart floating animations
    this.symbols.flat().forEach((symbol, index) => {
      const baseY = symbol.y;
      this.tweens.add({
        targets: symbol,
        y: baseY + 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    this.isSpinning = false;
    console.log(`Spin completed. Win amount: ${winAmount}`);
    return winAmount;
  }

  private async animateSpinSequence(): Promise<void> {
    return new Promise((resolve) => {
      const timeline = this.tweens.createTimeline();
      
      // Spin out animation
      timeline.add({
        targets: this.symbols.flat(),
        scale: 0,
        alpha: 0,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          // Update symbols during invisible state
          this.symbols.flat().forEach(symbol => {
            symbol.setText(generateRandomSymbol());
          });
        }
      });

      // Spin in animation
      timeline.add({
        targets: this.symbols.flat(),
        scale: 1,
        alpha: 1,
        duration: 300,
        ease: 'Back.easeOut',
        onComplete: resolve
      });

      timeline.play();
    });
  }
}