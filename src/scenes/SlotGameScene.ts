import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';
import { WinAnimationManager } from './effects/WinAnimationManager';
import { MessageManager } from './effects/MessageManager';
import { SoundManager } from './effects/SoundManager';
import { GridManager } from './managers/GridManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private winAnimationManager: WinAnimationManager;
  private messageManager: MessageManager;
  private soundManager: SoundManager;
  private gridManager: GridManager;
  private baseScale: number = 1;
  private bgImage?: Phaser.GameObjects.Image;
  private alienMessage?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game scene');
    
    // Initialize managers
    this.soundManager = new SoundManager(this);
    this.currentGrid = createInitialGrid();
    this.winAnimationManager = new WinAnimationManager(this);
    this.messageManager = new MessageManager(this);
    this.gridManager = new GridManager(this);
    
    // Setup scene
    this.setupBackground();
    this.setupAlienMessage();
    this.createGrid();
    this.startFloatingAnimations();
    
    // Continue background music if it exists
    const bgMusic = this.game.registry.get('bgMusic') as Phaser.Sound.BaseSound;
    if (bgMusic && !bgMusic.isPlaying) {
      console.log('SlotGameScene: Restarting background music');
      bgMusic.play({ volume: 0.5, loop: true });
    }
  }

  private setupBackground() {
    const { width, height } = this.cameras.main;
    this.bgImage = this.add.image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height)
      .setAlpha(0.3);

    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private setupAlienMessage() {
    const { width } = this.cameras.main;
    this.alienMessage = this.add.text(width / 2, 50, '', {
      fontFamily: 'Space Grotesk',
      fontSize: '24px',
      color: '#4AE54A',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(1000);
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
    this.symbols.flat().forEach(symbol => {
      this.tweens.killTweensOf(symbol);
    });
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
    });
  }

  private createGrid() {
    const { width, height } = this.cameras.main;
    const gridDimensions = this.gridManager.calculateGridDimensions(width, height);
    this.baseScale = gridDimensions.baseScale;

    console.log('SlotGameScene: Creating grid with dimensions:', gridDimensions);

    for (let row = 0; row < GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = gridDimensions.startX + col * (gridDimensions.cellSize + gridDimensions.gridPadding);
        const y = gridDimensions.startY + row * (gridDimensions.cellSize + gridDimensions.gridPadding);
        
        const symbol = this.add.text(x, y, this.currentGrid[row][col], {
          fontSize: `${SYMBOL_SIZE}px`,
          padding: { x: SYMBOL_SIZE * 0.02, y: SYMBOL_SIZE * 0.02 },
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

  public async startSpin(betAmount: number, multiplier: number): Promise<{ totalWinAmount: number; winningLines: any[] }> {
    if (this.isSpinning) {
      console.log('SlotGameScene: Spin already in progress, ignoring new spin request');
      return { totalWinAmount: 0, winningLines: [] };
    }

    console.log(`SlotGameScene: Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;
    this.stopFloatingAnimations();
    this.winAnimationManager.clearPreviousAnimations();

    try {
      await this.messageManager.showMessage("Initiating crop analysis...");
      
      this.soundManager.playSpinSound();
      
      // Perform spin animation
      await new Promise<void>((resolve) => {
        let completedSpins = 0;
        const totalSpins = GRID_SIZE * GRID_SIZE;

        for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
          for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
            const symbol = this.symbols[rowIndex][colIndex];
            
            this.tweens.add({
              targets: symbol,
              scaleX: 0,
              duration: 300,
              ease: 'Power1',
              onComplete: () => {
                const newSymbol = generateRandomSymbol();
                this.currentGrid[rowIndex][colIndex] = newSymbol;
                symbol.setText(newSymbol);
                
                this.tweens.add({
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

      await this.messageManager.showMessage("Analyzing energy patterns...");
      await new Promise(resolve => this.time.delayedCall(1000, resolve));

      const { totalWinAmount, winningLines } = calculateWinnings(this.currentGrid, betAmount, multiplier);
      
      if (winningLines.length > 0) {
        this.soundManager.playWinSound(totalWinAmount);
        
        for (const line of winningLines) {
          this.winAnimationManager.createWinAnimation(line.positions, this.symbols);
          await new Promise(resolve => this.time.delayedCall(500, resolve));
        }

        await this.messageManager.showMessage("Harvesting cosmic energy...");
        await new Promise(resolve => this.time.delayedCall(1000, resolve));
      } else {
        this.soundManager.playLoseSound();
        await this.messageManager.showMessage("Better luck next time...");
        await new Promise(resolve => this.time.delayedCall(1000, resolve));
      }

      console.log(`SlotGameScene: Spin completed. Win amount: ${totalWinAmount}`);
      this.isSpinning = false;
      return { totalWinAmount, winningLines };

    } catch (error) {
      console.error('SlotGameScene: Error during spin:', error);
      this.isSpinning = false;
      return { totalWinAmount: 0, winningLines: [] };
    }
  }
}
