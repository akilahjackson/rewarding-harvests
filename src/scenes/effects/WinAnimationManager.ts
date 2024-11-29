import Phaser from 'phaser';
import { ParticleManager } from './ParticleManager';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private activeEffects: Phaser.GameObjects.GameObject[] = [];
  private particleManager: ParticleManager;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    this.clearPreviousAnimations();
    
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      
      // Create particle effect
      const particles = this.scene.add.particles(symbol.x, symbol.y, 'particle', {
        lifespan: 2000,
        speed: { min: 50, max: 100 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 0.6, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        emitting: true,
        quantity: 1,
        frequency: 150,
        rotate: { min: 0, max: 360 }
      });

      particles.setDepth(symbol.depth - 2);
      this.activeEffects.push(particles);

      // Create highlight effect
      const highlight = this.scene.add.rectangle(
        symbol.x,
        symbol.y,
        symbol.width * 1.2,
        symbol.height * 1.2,
        0x4AE54A,
        0.2
      );
      highlight.setDepth(symbol.depth - 1);
      this.activeEffects.push(highlight);

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
    
    // Clear particle effects first
    this.particleManager.clearParticles();
    
    // Clear other active effects
    this.activeEffects.forEach(effect => {
      if (effect.active) {
        effect.destroy();
      }
    });
    
    // Reset the active effects array
    this.activeEffects = [];
  }
}