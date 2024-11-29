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
      
      // Create highlight effect
      const highlight = this.scene.add.rectangle(
        symbol.x,
        symbol.y,
        symbol.width * 1.2,
        symbol.height * 1.2,
        COLORS.neonGreen,
        0.2
      );
      highlight.setDepth(symbol.depth - 1);
      this.activeEffects.push(highlight);

      // Create concentric circles effect
      const graphics = this.scene.add.graphics();
      this.circles.push(graphics);
      
      // Draw three concentric circles
      [30, 40, 50].forEach((radius, index) => {
        graphics.lineStyle(2, COLORS.neonGreen, 1);
        graphics.strokeCircle(symbol.x, symbol.y, radius);
        
        // Animate each circle with a pulse effect
        this.scene.tweens.add({
          targets: graphics,
          alpha: 0.2,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: index * 200
        });
      });

      // Create particle effect
      this.particleManager.createWinParticles(symbol.x, symbol.y, symbol.width / 2);

      // Pulse animation for highlight
      this.scene.tweens.add({
        targets: highlight,
        alpha: 0.4,
        duration: 600,
        yoyo: true,
        repeat: -1
      });
    });
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    
    // Clear particle effects
    this.particleManager.clearParticles();
    
    // Clear circles
    this.circles.forEach(circle => {
      if (circle && circle.active) {
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