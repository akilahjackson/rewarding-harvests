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
    
    // Add scene cleanup listener
    this.scene.events.on('shutdown', this.clearPreviousAnimations, this);
    this.scene.events.on('destroy', this.clearPreviousAnimations, this);
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animations for positions:', positions);
    
    // Clear any existing animations before creating new ones
    this.clearPreviousAnimations();
    
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      
      // Create three concentric rings with different sizes and alphas
      const rings = [
        { radius: 45, alpha: 0.8, lineWidth: 3 },
        { radius: 35, alpha: 0.6, lineWidth: 2 },
        { radius: 25, alpha: 0.4, lineWidth: 2 }
      ];
      
      rings.forEach((ring, index) => {
        const graphics = this.scene.add.graphics();
        graphics.setDepth(100); // Set depth to be above symbols but below messages
        this.activeCircles.push(graphics);
        
        // Draw initial circle
        graphics.lineStyle(ring.lineWidth, COLORS.neonGreen, ring.alpha);
        graphics.strokeCircle(symbol.x, symbol.y, ring.radius);
        
        // Create slower flash animation with phase delay
        this.scene.tweens.add({
          targets: graphics,
          alpha: { from: ring.alpha, to: 0.1 },
          duration: 800 + (index * 200),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: index * 200,
          onUpdate: () => {
            graphics.clear();
            graphics.lineStyle(ring.lineWidth, COLORS.neonGreen, graphics.alpha);
            graphics.strokeCircle(symbol.x, symbol.y, ring.radius);
          },
          onComplete: () => {
            graphics.clear();
            graphics.destroy();
            const index = this.activeCircles.indexOf(graphics);
            if (index > -1) {
              this.activeCircles.splice(index, 1);
            }
          }
        });
      });
    });
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    
    this.activeCircles.forEach(circle => {
      if (circle && circle.active) {
        this.scene.tweens.killTweensOf(circle);
        circle.clear(); // Clear the graphics before destroying
        circle.destroy();
      }
    });
    this.activeCircles = [];
    this.particleManager.clearParticles();
  }

  destroy(): void {
    this.clearPreviousAnimations();
    this.scene.events.off('shutdown', this.clearPreviousAnimations, this);
    this.scene.events.off('destroy', this.clearPreviousAnimations, this);
    this.particleManager.destroy();
  }
}