import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';
import { WinAnimationManager } from './effects/WinAnimationManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private floatingTweens: Phaser.Tweens.Tween[] = [];
  private winAnimationManager: WinAnimationManager;
  private baseScale: number = 1;

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game grid');
    
    // Create glowing particle texture
    const particleTexture = this.add.graphics();
    particleTexture.clear();
    
    // Create a circular glow effect with 3 layers
    const radius = 64;
    const colors = [
      { radius: 0, color: 0x4AE54A, alpha: 1 },
      { radius: 0.4, color: 0x4AE54A, alpha: 0.6 },
      { radius: 1, color: 0x4AE54A, alpha: 0 }
    ];

    colors.forEach((stop) => {
      const color = stop.color;
      const alpha = stop.alpha;
      particleTexture.fillStyle(color, alpha);
      particleTexture.fillCircle(
        radius/2, 
        radius/2, 
        radius/2 * (1 - stop.radius)
      );
    });
    
    // Generate texture from graphics
    particleTexture.generateTexture('particle', radius, radius);
    particleTexture.destroy();

    this.currentGrid = createInitialGrid();
    this.winAnimationManager = new WinAnimationManager(this);
    this.createGrid();
    this.startFloatingAnimations();
  }

  private adjustGridScale(hasWinningLines: boolean) {
    const scale = hasWinningLines ? 0.9 : 1;
    this.symbols.flat().forEach(symbol => {
      this.tweens.add({
        targets: symbol,
        scale: this.baseScale * scale,
        duration: 200,
        ease: 'Power2'
      });
    });
  }

  private stopFloatingAnimations() {
    console.log('SlotGameScene: Stopping floating animations');
    this.floatingTweens.forEach(tween => {
      if (tween.isPlaying()) {
        tween.stop();
      }
    });
    this.floatingTweens = [];
  }

  private startFloatingAnimations() {
    if (this.isSpinning) {
      console.log('SlotGameScene: Skipping floating animations while spinning');
      return;
    }
    
    console.log('SlotGameScene: Starting floating animations');
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

  private createGrid() {
    const { width, height } = this.cameras.main;
    const padding = Math.min(width, height) * 0.15;
    const gridPadding = Math.min(width, height) * 0.04; // 4% padding between pieces
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    const cellSize = Math.min(
      (availableWidth - (gridPadding * (GRID_SIZE - 1))) / GRID_SIZE,
      (availableHeight - (gridPadding * (GRID_SIZE - 1))) / GRID_SIZE
    );

    const startX = (width - ((cellSize + gridPadding) * (GRID_SIZE - 1))) / 2;
    const startY = (height - ((cellSize + gridPadding) * (GRID_SIZE - 1))) / 2;
    this.baseScale = cellSize / SYMBOL_SIZE;

    console.log('SlotGameScene: Creating grid with dimensions:', {
      width,
      height,
      cellSize,
      startX,
      startY,
      baseScale: this.baseScale,
      gridPadding
    });

    for (let row = 0; row < GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = startX + col * (cellSize + gridPadding);
        const y = startY + row * (cellSize + gridPadding);
        
        const symbol = this.add.text(x, y, this.currentGrid[row][col], {
          fontSize: `${SYMBOL_SIZE}px`,
          padding: { x: SYMBOL_SIZE * 0.02, y: SYMBOL_SIZE * 0.02 },
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000000',
            blur: 5,
            fill: true
          }
        })
        .setOrigin(0.5)
        .setScale(this.baseScale)
        .setInteractive();
        
        symbol.setData('originalY', y);
        symbol.setData('isFloating', true);
        this.symbols[row][col] = symbol;
      }
    }
  }

  public async startSpin(betAmount: number, multiplier: number): Promise<number> {
    if (this.isSpinning) {
      console.log('SlotGameScene: Spin already in progress, ignoring new spin request');
      return 0;
    }

    console.log(`SlotGameScene: Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;
    this.stopFloatingAnimations();
    this.winAnimationManager.clearPreviousAnimations();
    this.adjustGridScale(false);

    try {
      await new Promise<void>((resolve) => {
        let completedSpins = 0;
        const totalSpins = GRID_SIZE * GRID_SIZE;
        const spinDuration = 300;

        for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
          for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
            const symbol = this.symbols[rowIndex][colIndex];
            
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
                  scaleX: this.baseScale,
                  duration: spinDuration,
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

      const { winAmount, winningLines } = calculateWinnings(this.currentGrid, betAmount, multiplier);
      
      if (winningLines.length > 0) {
        console.log('SlotGameScene: Win detected! Creating win animations');
        this.adjustGridScale(true);
        winningLines.forEach(line => {
          this.winAnimationManager.createWinAnimation(line.positions, this.symbols);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`SlotGameScene: Spin completed. Win amount: ${winAmount}`);
      this.isSpinning = false;
      this.startFloatingAnimations();
      return winAmount;

    } catch (error) {
      console.error('SlotGameScene: Error during spin:', error);
      this.isSpinning = false;
      this.startFloatingAnimations();
      return 0;
    }
  }
}
