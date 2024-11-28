import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';
import { ParticleManager } from './ParticleManager';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private particleManager: ParticleManager;
  private winCircles: Phaser.GameObjects.Graphics[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    this.winCircles = [];
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    
    this.clearPreviousAnimations();

    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      this.createWinningSymbolAnimation(symbol);
    });

    if (positions.length > 1) {
      this.createPaylineAnimation(positions, symbols);
    }
  }

  private createWinningSymbolAnimation(symbol: Phaser.GameObjects.Text): void {
    const circle = this.scene.add.graphics();
    const radius = 30;
    
    circle.lineStyle(2, COLORS.neonGreen, 1);
    circle.fillStyle(COLORS.neonGreen, 0.3);
    
    // Animate circle drawing
    this.scene.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 1000,
      onUpdate: (tween) => {
        circle.clear();
        const currentAngle = Math.PI * 2 * tween.getValue();
        circle.beginPath();
        circle.arc(symbol.x, symbol.y, radius, 0, currentAngle);
        circle.strokePath();
        circle.fillCircle(symbol.x, symbol.y, radius);
      },
      onComplete: () => {
        this.particleManager.createWinParticles(symbol.x, symbol.y, radius);
      }
    });

    this.winCircles.push(circle);

    // Symbol pulse animation
    this.scene.tweens.add({
      targets: symbol,
      scale: 1.2,
      duration: 200,
      yoyo: true,
      repeat: 2
    });
  }

  private createPaylineAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    const points = positions.map(([row, col]) => ({
      x: symbols[row][col].x,
      y: symbols[row][col].y
    }));

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, COLORS.neonGreen, 0.8);

    this.scene.tweens.add({
      targets: { progress: 0 },
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
        this.particleManager.createPaylineParticles(points);
      }
    });

    this.winCircles.push(graphics);
  }

  clearPreviousAnimations(): void {
    this.winCircles.forEach(circle => circle.destroy());
    this.winCircles = [];
    this.particleManager.clearParticles();
  }
}