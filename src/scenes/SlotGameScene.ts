import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game grid');
    this.currentGrid = createInitialGrid();
    this.createGrid();
  }

  private createWinAnimation(positions: number[][]) {
    positions.forEach(([row, col]) => {
      const symbol = this.symbols[row][col];
      
      this.tweens.add({
        targets: symbol,
        scale: 1.2,
        duration: 200,
        yoyo: true,
        repeat: 5,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          symbol.setScale(1);
        }
      });
    });
  }

  public async startSpin(betAmount: number, multiplier: number): Promise<number> {
    if (this.isSpinning) {
      console.log('Spin already in progress');
      return 0;
    }

    console.log(`Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;

    // Stop any existing animations
    this.symbols.flat().forEach(symbol => {
      this.tweens.killTweensOf(symbol);
    });

    // Create a sequence of promises for the spin animation
    const spinPromises = this.symbols.map((row, rowIndex) => {
      return Promise.all(row.map((symbol, colIndex) => {
        return new Promise<void>((resolve) => {
          const spinTween = this.tweens.add({
            targets: symbol,
            scaleX: { from: 1, to: 0 },
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
              // Update symbol when it's invisible
              const newSymbol = generateRandomSymbol();
              this.currentGrid[rowIndex][colIndex] = newSymbol;
              symbol.setText(newSymbol);
              
              // Spin back
              this.tweens.add({
                targets: symbol,
                scaleX: { from: 0, to: 1 },
                duration: 300,
                ease: 'Power1',
                onComplete: () => resolve()
              });
            }
          });
        });
      }));
    });

    // Wait for all spin animations to complete
    await Promise.all(spinPromises.flat());

    // Calculate winnings and animate winning lines
    const { winAmount, winningLines } = calculateWinnings(this.currentGrid, betAmount, multiplier);
    
    if (winningLines.length > 0) {
      winningLines.forEach(line => {
        this.createWinAnimation(line.positions);
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Restart floating animations
    this.symbols.flat().forEach((symbol) => {
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
}