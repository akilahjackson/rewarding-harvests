import Phaser from 'phaser';
import { ParticleManager } from './ParticleManager';
import { COLORS } from '../configs/styleConfig';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private activeEffects: Phaser.GameObjects.GameObject[] = [];
  private particleManager: ParticleManager;
  private circles: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    this.clearPreviousAnimations();
    
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      
      // Create single circle effect
      const graphics = this.scene.add.graphics();
      this.circles.push(graphics);
      
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

      // Create particle effect without background highlight
      this.particleManager.createWinParticles(symbol.x, symbol.y, symbol.width / 2);
    });
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    
    // Clear particle effects
    this.particleManager.clearParticles();
    
    // Clear circles
    this.circles.forEach(circle => {
      if (circle && circle.active) {
        this.scene.tweens.killTweensOf(circle);
        circle.destroy();
      }
    });
    this.circles = [];
    
    // Clear other active effects
    this.activeEffects.forEach(effect => {
      if (effect && effect.active) {
        effect.destroy();
      }
    });
    
    this.activeEffects = [];
  }
}