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
      this.createConcentricCircles(symbol.x, symbol.y);

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

  private createConcentricCircles(x: number, y: number): void {
    const graphics = this.scene.add.graphics();
    this.circles.push(graphics);

    const radiusSizes = [20, 30, 40];
    radiusSizes.forEach((baseRadius, index) => {
      const circle = graphics.lineStyle(2, COLORS.neonGreen, 1);
      circle.strokeCircle(x, y, baseRadius);

      // Animate each circle
      this.scene.tweens.add({
        targets: circle,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 1000 + (index * 200),
        repeat: -1,
        onUpdate: () => {
          graphics.clear();
          graphics.lineStyle(2, COLORS.neonGreen, circle.alpha);
          graphics.strokeCircle(x, y, baseRadius * circle.scaleX);
        }
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