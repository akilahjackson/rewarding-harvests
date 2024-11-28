import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private floatingTweens: Phaser.Tweens.Tween[] = [];

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
        repeat: 2,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          symbol.setScale(1);
        }
      });
    });
  }

  private stopFloatingAnimations() {
    this.floatingTweens.forEach(tween => {
      if (tween.isPlaying()) {
        tween.stop();
      }
    });
    this.floatingTweens = [];
  }

  private startFloatingAnimations() {
    this.symbols.flat().forEach((symbol) => {
      const baseY = symbol.y;
      const tween = this.tweens.add({
        targets: symbol,
        y: baseY + 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.floatingTweens.push(tween);
    });
  }

  public async startSpin(betAmount: number, multiplier: number): Promise<number> {
    if (this.isSpinning) return 0;

    console.log(`Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;
    this.stopFloatingAnimations();
    this.tweens.killAll();

    try {
      await new Promise<void>((resolve) => {
        const spinPromises: Promise<void>[] = [];
        const spinDuration = 300;

        for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
          for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
            const symbol = this.symbols[rowIndex][colIndex];
            
            const promise = new Promise<void>((resolveSymbol) => {
              symbol.setScale(1);
              
              this.tweens.add({
                targets: symbol,
                scaleX: 0,
                duration: spinDuration,
                ease: 'Power1',
                onComplete: () => {
                  const newSymbol = generateRandomSymbol();
                  this.currentGrid[rowIndex][colIndex] = newSymbol;
                  symbol.setText(newSymbol);
                  
                  this.tweens.add({
                    targets: symbol,
                    scaleX: 1,
                    duration: spinDuration,
                    ease: 'Power1',
                    onComplete: () => {
                      resolveSymbol();
                    }
                  });
                }
              });
            });
            
            spinPromises.push(promise);
          }
        }

        Promise.all(spinPromises).then(() => resolve());
      });

      const { winAmount, winningLines } = calculateWinnings(this.currentGrid, betAmount, multiplier);
      
      if (winningLines.length > 0) {
        winningLines.forEach(line => this.createWinAnimation(line.positions));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.startFloatingAnimations();
      this.isSpinning = false;
      return winAmount;

    } catch (error) {
      console.error('Error during spin:', error);
      this.isSpinning = false;
      this.startFloatingAnimations();
      return 0;
    }
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
      }
    }

    this.startFloatingAnimations();
  }
}