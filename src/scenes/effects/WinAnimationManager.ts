import Phaser from 'phaser';
import { ParticleManager } from './ParticleManager';
import { COLORS } from '../configs/styleConfig';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private activeCircles: Phaser.GameObjects.Graphics[] = [];
  private particleManager: ParticleManager;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animations for positions:', positions);
    
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      
      // Create multiple concentric circles for each winning position
      const circleCount = 3;
      for (let i = 0; i < circleCount; i++) {
        const graphics = this.scene.add.graphics();
        this.activeCircles.push(graphics);
        
        // Initial circle properties
        const baseRadius = 30 + (i * 15); // Increasing radius for each circle
        const baseAlpha = 0.8 - (i * 0.2); // Decreasing alpha for outer circles
        
        // Draw initial circle
        graphics.lineStyle(2, COLORS.neonGreen, baseAlpha);
        graphics.strokeCircle(symbol.x, symbol.y, baseRadius);
        
        // Create pulsing animation
        this.scene.tweens.add({
          targets: graphics,
          alpha: { from: baseAlpha, to: 0.2 },
          scaleX: { from: 1, to: 1.2 },
          scaleY: { from: 1, to: 1.2 },
          duration: 1500 + (i * 300), // Slightly different timing for each circle
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            graphics.clear();
            graphics.lineStyle(2, COLORS.neonGreen, graphics.alpha);
            graphics.strokeCircle(symbol.x, symbol.y, baseRadius * graphics.scaleX);
          }
        });
      }
    });
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    
    this.activeCircles.forEach(circle => {
      if (circle && circle.active) {
        this.scene.tweens.killTweensOf(circle);
        circle.destroy();
      }
    });
    this.activeCircles = [];
    this.particleManager.clearParticles();
  }
}