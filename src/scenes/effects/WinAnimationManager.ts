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
      
      // Create persistent circle effect
      const graphics = this.scene.add.graphics();
      this.activeCircles.push(graphics);
      
      // Draw circle with constant visibility
      graphics.lineStyle(2, COLORS.neonGreen, 1);
      graphics.strokeCircle(symbol.x, symbol.y, 40);
      
      // Gentle pulse animation that maintains visibility
      this.scene.tweens.add({
        targets: graphics,
        alpha: { from: 0.8, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
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