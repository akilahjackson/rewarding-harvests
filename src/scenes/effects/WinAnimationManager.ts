import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';
import { ParticleManager } from './ParticleManager';

interface TweenValues {
  progress: number;
  circles: number;
}

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

    // Stop all floating animations during win sequence
    symbols.flat().forEach(symbol => {
      symbol.setData('isFloating', false);
      this.scene.tweens.killTweensOf(symbol);
      symbol.y = symbol.getData('originalY') || symbol.y;
    });

    // Calculate the maximum radius based on symbol size
    const maxRadius = Math.max(...positions.map(([row, col]) => {
      const symbol = symbols[row][col];
      return Math.max(symbol.width, symbol.height) * this.symbolScale;
    }));

    // Create animations only for winning symbols
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      this.createWinningSymbolAnimation(symbol, maxRadius);
      this.createAlienFlashEffect(symbol);
    });

    // Create payline animation if there are multiple winning positions
    if (positions.length > 1) {
      this.createPaylineAnimation(positions, symbols);
    }
  }

  private createAlienFlashEffect(symbol: Phaser.GameObjects.Text): void {
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

  private createWinningSymbolAnimation(symbol: Phaser.GameObjects.Text, maxRadius: number): void {
    const circle = this.scene.add.graphics();
    
    // Scale up only winning symbols
    this.scene.tweens.add({
      targets: symbol,
      scale: this.symbolScale,
      duration: 200,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });
    
    // Create concentric circles that animate down to one
    const numberOfCircles = 4;
    const duration = 1500;
    
    const tweenTarget = { progress: 0, circles: numberOfCircles };
    
    this.scene.tweens.add({
      targets: tweenTarget,
      progress: 1,
      circles: 1,
      duration: duration,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        circle.clear();
        const currentCircles = Math.ceil(tweenTarget.circles);
        const progress = tweenTarget.progress;
        
        for (let i = 0; i < currentCircles; i++) {
          const circleRadius = maxRadius * (0.6 + (i * 0.15)) * (1 + Math.sin(progress * Math.PI) * 0.1);
          circle.lineStyle(2, COLORS.neonGreen, 1 - (i * 0.2));
          circle.beginPath();
          circle.arc(symbol.x, symbol.y, circleRadius, 0, Math.PI * 2);
          circle.strokePath();
        }
        
        // Inner glow effect
        circle.fillStyle(COLORS.neonGreen, 0.2);
        circle.fillCircle(symbol.x, symbol.y, maxRadius * 0.6);
      },
      onComplete: () => {
        // Create persistent single circle with particle effect
        this.particleManager.createWinParticles(symbol.x, symbol.y, maxRadius * 0.6);
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
        const progress = tween.getValue() as number;
        
        // Draw connecting lines between winning symbols
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