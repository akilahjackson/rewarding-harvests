import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE, SPIN_DURATION } from './configs/symbolConfig';
import { calculateWinnings } from './utils/winCalculator';
import { createInitialGrid, generateRandomSymbol } from './utils/gridManager';

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Text[][] = [];
  private isSpinning: boolean = false;
  private currentGrid: string[][] = [];
  private floatingTweens: Phaser.Tweens.Tween[] = [];
  private winCircles: Phaser.GameObjects.Graphics[] = [];
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager | null = null;

  constructor() {
    super({ key: 'SlotGameScene' });
    console.log('SlotGameScene: Constructor initialized');
  }

  create() {
    console.log('SlotGameScene: Creating game grid');
    this.currentGrid = createInitialGrid();
    this.createParticleSystem();
    this.createGrid();
    this.startFloatingAnimations();
  }

  private createParticleSystem() {
    this.particles = this.add.particles('star');
    // Will be used for win animations
  }

  private createWinAnimation(positions: number[][]) {
    console.log('SlotGameScene: Creating win animation for positions:', positions);
    
    // Clear previous win circles
    this.winCircles.forEach(circle => circle.destroy());
    this.winCircles = [];

    // Create crop circle effect for each winning position
    positions.forEach(([row, col]) => {
      const symbol = this.symbols[row][col];
      const circle = this.add.graphics();
      
      // Set style for win highlight
      circle.lineStyle(2, 0x4AE54A, 1);
      circle.fillStyle(0x4AE54A, 0.3);
      
      // Create circle animation
      const radius = 30;
      const x = symbol.x;
      const y = symbol.y;
      
      // Animate circle drawing
      let progress = 0;
      const circleAnim = this.tweens.add({
        targets: { progress },
        progress: 1,
        duration: 1000,
        onUpdate: (tween) => {
          circle.clear();
          const currentAngle = Math.PI * 2 * tween.getValue();
          circle.beginPath();
          circle.arc(x, y, radius, 0, currentAngle);
          circle.strokePath();
          circle.fillCircle(x, y, radius);
        },
        onComplete: () => {
          // Add particle effect tracing the circle
          if (this.particles) {
            const emitter = this.particles.createEmitter({
              x: x,
              y: y,
              speed: { min: 50, max: 100 },
              scale: { start: 0.2, end: 0 },
              alpha: { start: 1, end: 0 },
              lifespan: 1000,
              blendMode: Phaser.BlendModes.ADD,
              tint: 0x4AE54A
            });

            // Make particles follow circle path
            this.tweens.add({
              targets: { angle: 0 },
              angle: 360,
              duration: 2000,
              repeat: -1,
              onUpdate: (tween) => {
                const angle = Phaser.Math.DegToRad(tween.getValue());
                emitter.setPosition(
                  x + Math.cos(angle) * radius,
                  y + Math.sin(angle) * radius
                );
              }
            });
          }
        }
      });

      this.winCircles.push(circle);

      // Make symbol pulse
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

    // Create connecting lines between winning positions
    if (positions.length > 1) {
      const graphics = this.add.graphics();
      graphics.lineStyle(2, 0x4AE54A, 0.8);
      
      // Draw line animation
      const points = positions.map(([row, col]) => ({
        x: this.symbols[row][col].x,
        y: this.symbols[row][col].y
      }));

      let progress = 0;
      this.tweens.add({
        targets: { progress },
        progress: 1,
        duration: 1000,
        onUpdate: (tween) => {
          graphics.clear();
          const currentProgress = tween.getValue();
          
          for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            const x = Phaser.Math.Linear(start.x, end.x, currentProgress);
            const y = Phaser.Math.Linear(start.y, end.y, currentProgress);
            
            if (i === 0) graphics.moveTo(start.x, start.y);
            graphics.lineTo(x, y);
          }
          graphics.strokePath();
        },
        onComplete: () => {
          // Add floating particles along the win line
          if (this.particles) {
            points.forEach((point, i) => {
              if (i < points.length - 1) {
                const emitter = this.particles.createEmitter({
                  x: point.x,
                  y: point.y,
                  speed: { min: 20, max: 50 },
                  scale: { start: 0.1, end: 0 },
                  alpha: { start: 0.6, end: 0 },
                  lifespan: 1000,
                  blendMode: Phaser.BlendModes.ADD,
                  tint: 0x4AE54A
                });

                // Make particles float towards next point
                this.tweens.add({
                  targets: emitter,
                  x: points[i + 1].x,
                  y: points[i + 1].y,
                  duration: 2000,
                  repeat: -1,
                  ease: 'Linear'
                });
              }
            });
          }
        }
      });

      this.winCircles.push(graphics);
    }
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

  public async startSpin(betAmount: number, multiplier: number): Promise<number> {
    if (this.isSpinning) {
      console.log('SlotGameScene: Spin already in progress, ignoring new spin request');
      return 0;
    }

    console.log(`SlotGameScene: Starting spin with bet: ${betAmount} and multiplier: ${multiplier}`);
    this.isSpinning = true;
    this.stopFloatingAnimations();

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
                  scaleX: 1,
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
        winningLines.forEach(line => this.createWinAnimation(line.positions));
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

    console.log('SlotGameScene: Creating grid with dimensions:', {
      width,
      height,
      cellSize,
      startX,
      startY
    });

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
  }
}
