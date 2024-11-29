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
        0x4AE54A,
        0.2
      );
      highlight.setDepth(symbol.depth - 1);
      this.activeEffects.push(highlight);

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
    
    // Clear particle effects first
    this.particleManager.clearParticles();
    
    // Clear other active effects
    this.activeEffects.forEach(effect => {
      if (effect && effect.active) {
        effect.destroy();
      }
    });
    
    this.activeEffects = [];
  }
}