import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';
import { ParticleManager } from './ParticleManager';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private particleManager: ParticleManager;
  private winCircles: Phaser.GameObjects.Graphics[];
  private symbolScale: number = 1.05;
  private flashTweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    this.winCircles = [];
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    
    this.clearPreviousAnimations();

    const maxRadius = Math.max(...positions.map(([row, col]) => {
      const symbol = symbols[row][col];
      return Math.max(symbol.width, symbol.height) * this.symbolScale;
    }));

    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      this.createWinningSymbolAnimation(symbol, maxRadius);
      this.createAlienFlashEffect(symbol);
    });

    if (positions.length > 1) {
      this.createPaylineAnimation(positions, symbols);
    }
  }

  private createAlienFlashEffect(symbol: Phaser.GameObjects.Text): void {
    // Create alien-like flashing background
    const flashTween = this.scene.tweens.add({
      targets: symbol,
      alpha: 0.7,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        symbol.setShadow(
          2 + Math.random() * 2,
          2 + Math.random() * 2,
          '#4AE54A',
          5 + Math.random() * 5
        );
      }
    });
    
    this.flashTweens.push(flashTween);
  }

  private createWinningSymbolAnimation(symbol: Phaser.GameObjects.Text, radius: number): void {
    const circle = this.scene.add.graphics();
    
    // Scale up the symbol with alien effect
    this.scene.tweens.add({
      targets: symbol,
      scale: this.symbolScale * 1.05, // Additional 5% scale for winning symbols
      duration: 200,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });
    
    // Draw alien crop circle effect
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
        
        // Draw multiple circles for enhanced crop circle effect
        for (let i = 0; i < 4; i++) {
          const circleRadius = currentRadius * (0.6 + (i * 0.15));
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
    this.flashTweens.forEach(tween => tween.stop());
    this.flashTweens = [];
    this.particleManager.clearParticles();
  }
}