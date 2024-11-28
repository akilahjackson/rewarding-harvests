import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';
import { ParticleManager } from './ParticleManager';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private particleManager: ParticleManager;
  private winCircles: Phaser.GameObjects.Graphics[];
  private symbolScale: number = 1.05;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    this.winCircles = [];
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    
    this.clearPreviousAnimations();

    // Calculate required space for animations
    const maxRadius = Math.max(...positions.map(([row, col]) => {
      const symbol = symbols[row][col];
      return Math.max(symbol.width, symbol.height) * this.symbolScale;
    }));

    // Scale winning symbols
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      this.createWinningSymbolAnimation(symbol, maxRadius);
    });

    if (positions.length > 1) {
      this.createPaylineAnimation(positions, symbols);
    }
  }

  private createWinningSymbolAnimation(symbol: Phaser.GameObjects.Text, radius: number): void {
    const circle = this.scene.add.graphics();
    
    // Scale up the symbol
    this.scene.tweens.add({
      targets: symbol,
      scale: this.symbolScale,
      duration: 200,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });
    
    // Draw crop circle effect
    circle.lineStyle(2, COLORS.neonGreen, 1);
    circle.fillStyle(COLORS.neonGreen, 0.3);
    
    this.scene.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 1000,
      onUpdate: (tween) => {
        circle.clear();
        const progress = tween.getValue();
        const currentRadius = radius * progress;
        
        // Draw multiple circles for crop circle effect
        for (let i = 0; i < 3; i++) {
          const circleRadius = currentRadius * (0.6 + (i * 0.2));
          circle.beginPath();
          circle.arc(symbol.x, symbol.y, circleRadius, 0, Math.PI * 2);
          circle.strokePath();
        }
        
        circle.fillCircle(symbol.x, symbol.y, currentRadius * 0.6);
      },
      onComplete: () => {
        this.particleManager.createWinParticles(symbol.x, symbol.y, radius);
      }
    });

    this.winCircles.push(circle);
  }

  private createPaylineAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    const points = positions.map(([row, col]) => ({
      x: symbols[row][col].x,
      y: symbols[row][col].y
    }));

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(3, COLORS.neonGreen, 0.8);

    this.scene.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 1500,
      onUpdate: (tween) => {
        graphics.clear();
        const progress = tween.getValue();
        
        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i];
          const end = points[i + 1];
          const x = Phaser.Math.Linear(start.x, end.x, progress);
          const y = Phaser.Math.Linear(start.y, end.y, progress);
          
          if (i === 0) graphics.moveTo(start.x, start.y);
          graphics.lineTo(x, y);
        }
        graphics.strokePath();
      },
      onComplete: () => {
        this.particleManager.createPaylineParticles(points);
      }
    });

    this.winCircles.push(graphics);
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    this.winCircles.forEach(circle => circle.destroy());
    this.winCircles = [];
    this.particleManager.clearParticles();
  }
}