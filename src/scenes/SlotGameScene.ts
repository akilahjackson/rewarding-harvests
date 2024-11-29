import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE } from './configs/symbolConfig';
import { createInitialGrid } from './utils/gridManager';
import { WinAnimationManager } from './effects/WinAnimationManager';
import { MessageManager } from './effects/MessageManager';
import { SoundManager } from './effects/SoundManager';
import { GridManager } from './managers/GridManager';
import { SpinManager } from './managers/SpinManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private winAnimationManager: WinAnimationManager;
  private messageManager: MessageManager;
  private soundManager: SoundManager;
  private gridManager: GridManager;
  private spinManager: SpinManager;
  private baseScale: number = 1;
  private bgImage?: Phaser.GameObjects.Image;
  private alienMessage?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game scene');
    
    // Clear any existing game objects
    this.children.removeAll(true);
    this.add.graphics().clear();
    
    this.initializeManagers();
    this.setupBackground();
    this.setupAlienMessage();
    this.createGrid();
    this.startFloatingAnimations();
    
    // Setup scene cleanup
    this.events.on('shutdown', this.cleanup, this);
    
    const bgMusic = this.game.registry.get('bgMusic') as Phaser.Sound.BaseSound;
    if (bgMusic && !bgMusic.isPlaying) {
      console.log('SlotGameScene: Restarting background music');
      bgMusic.play({ volume: 0.5, loop: true });
    }
  }

  private cleanup(): void {
    console.log('SlotGameScene: Cleaning up scene');
    this.winAnimationManager.clearPreviousAnimations();
    this.stopFloatingAnimations();
    this.events.off('shutdown', this.cleanup, this);
  }

  private initializeManagers() {
    this.soundManager = new SoundManager(this);
    this.currentGrid = createInitialGrid();
    this.winAnimationManager = new WinAnimationManager(this);
    this.messageManager = new MessageManager(this);
    this.gridManager = new GridManager(this);
  }

  private setupBackground() {
    const { width, height } = this.cameras.main;
    this.bgImage = this.add.image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height)
      .setAlpha(0.3);
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

    this.spinManager = new SpinManager(
      this,
      this.symbols,
      this.currentGrid,
      this.baseScale,
      this.messageManager,
      this.soundManager,
      this.winAnimationManager
    );
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
      this.tweens.add({
        targets: symbol,
        y: baseY + 10,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
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
      const result = await this.spinManager.performSpin(betAmount, multiplier);
      this.isSpinning = false;
      return result;
    } catch (error) {
      console.error('SlotGameScene: Error during spin:', error);
      this.isSpinning = false;
      return { totalWinAmount: 0, winningLines: [] };
    }
  }
}
