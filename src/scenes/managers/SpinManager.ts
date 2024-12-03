import { calculateWinnings } from '../utils/winCalculator';
import { generateRandomSymbol } from '../utils/gridManager';
import { GRID_SIZE } from '../configs/symbolConfig';

export class SpinManager {
  private scene: Phaser.Scene;
  private symbols: Phaser.GameObjects.Image[][];
  private currentGrid: string[][];
  private baseScale: number;
  private messageManager: any;
  private soundManager: any;
  private winAnimationManager: any;

  constructor(
    scene: Phaser.Scene, 
    symbols: Phaser.GameObjects.Image[][], 
    currentGrid: string[][], 
    baseScale: number, 
    messageManager: any, 
    soundManager: any, 
    winAnimationManager: any
  ) {
    this.scene = scene;
    this.symbols = symbols;
    this.currentGrid = currentGrid;
    this.baseScale = baseScale;
    this.messageManager = messageManager;
    this.soundManager = soundManager;
    this.winAnimationManager = winAnimationManager;
  }

  async performSpin(betAmount: number, multiplier: number): Promise<{ totalWinAmount: number; winningLines: any[] }> {
    console.log(`SpinManager: Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    
    try {
      await this.messageManager.showMessage("Initiating crop analysis...", 1000);
      this.soundManager.playSpinSound();
      
      await this.animateSpinSequence();
      await this.messageManager.showMessage("Analyzing energy patterns...", 1000);
      await new Promise(resolve => this.scene.time.delayedCall(1000, resolve));

      const results = await this.processSpinResults(betAmount, multiplier);
      return results;
    } catch (error) {
      console.error('SpinManager: Error during spin:', error);
      return { totalWinAmount: 0, winningLines: [] };
    }
  }

  private async animateSpinSequence(): Promise<void> {
    return new Promise<void>((resolve) => {
      let completedSpins = 0;
      const totalSpins = GRID_SIZE * GRID_SIZE;

      for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
        for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
          const symbol = this.symbols[rowIndex][colIndex];
          
          this.scene.tweens.add({
            targets: symbol,
            scaleX: 0,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
              const newSymbol = generateRandomSymbol();
              this.currentGrid[rowIndex][colIndex] = newSymbol;
              symbol.setTexture(`symbol-${newSymbol}`);
              
              this.scene.tweens.add({
                targets: symbol,
                scaleX: this.baseScale,
                duration: 300,
                ease: 'Power1',
                onComplete: () => {
                  completedSpins++;
                  if (completedSpins === totalSpins) {
                    resolve();
                  }
                }
              });
            }
          });
        }
      }
    });
  }

  private async processSpinResults(betAmount: number, multiplier: number): Promise<{ totalWinAmount: number; winningLines: any[] }> {
    const { totalWinAmount, winningLines } = calculateWinnings(this.currentGrid, betAmount, multiplier);
    
    if (winningLines.length > 0) {
      this.soundManager.playWinSound(totalWinAmount);
      
      for (const line of winningLines) {
        this.winAnimationManager.createWinAnimation(line.positions, this.symbols);
        await new Promise(resolve => this.scene.time.delayedCall(500, resolve));
      }

      await this.messageManager.showMessage("Harvesting cosmic energy...", 1000);
      await new Promise(resolve => this.scene.time.delayedCall(1000, resolve));
    } else {
      this.soundManager.playLoseSound();
      await this.messageManager.showMessage("Better luck next time...", 1000);
      await new Promise(resolve => this.scene.time.delayedCall(1000, resolve));
    }

    return { totalWinAmount, winningLines };
  }
}