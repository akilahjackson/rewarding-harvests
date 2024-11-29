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
      
      // Create tight circle effect around symbol
      const graphics = this.scene.add.graphics();
      this.activeCircles.push(graphics);
      
      // Initial circle properties
      const radius = 35; // Tighter radius
      
      // Draw initial circle
      graphics.lineStyle(3, COLORS.neonGreen, 0.8);
      graphics.strokeCircle(symbol.x, symbol.y, radius);
      
      // Create rapid flash animation
      this.scene.tweens.add({
        targets: graphics,
        alpha: { from: 0.8, to: 0.2 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          graphics.clear();
          graphics.lineStyle(3, COLORS.neonGreen, graphics.alpha);
          graphics.strokeCircle(symbol.x, symbol.y, radius);
        }
      });

      // Add subtle glow effect
      const glowGraphics = this.scene.add.graphics();
      this.activeCircles.push(glowGraphics);
      
      this.scene.tweens.add({
        targets: glowGraphics,
        alpha: { from: 0.4, to: 0.1 },
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          glowGraphics.clear();
          glowGraphics.lineStyle(6, COLORS.neonGreen, glowGraphics.alpha);
          glowGraphics.strokeCircle(symbol.x, symbol.y, radius + 5);
        }
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