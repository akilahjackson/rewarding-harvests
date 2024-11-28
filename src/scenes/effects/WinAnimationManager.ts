import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private activeEffects: (Phaser.GameObjects.Graphics | Phaser.GameObjects.Particles.ParticleEmitter)[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    
    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      const circle = this.scene.add.graphics();
      circle.setDepth(symbol.depth - 1);
      
      // Create pulsing circle animation
      const radius = Math.max(symbol.width, symbol.height) * 0.6;
      
      this.scene.tweens.add({
        targets: { radius: radius * 0.8 },
        radius: radius * 1.2,
        duration: 1000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        onUpdate: (tween, target) => {
          circle.clear();
          
          // Draw multiple circles for glow effect
          const layers = [
            { alpha: 0.8, scale: 1.0 },
            { alpha: 0.4, scale: 1.1 },
            { alpha: 0.2, scale: 1.2 }
          ];
          
          layers.forEach(layer => {
            circle.lineStyle(2, COLORS.neonGreen, layer.alpha);
            circle.strokeCircle(
              symbol.x, 
              symbol.y, 
              target.radius * layer.scale
            );
          });
        }
      });

      this.activeEffects.push(circle);

      // Single particle per winning symbol
      const particles = this.scene.add.particles(symbol.x, symbol.y, 'particle', {
        lifespan: 2000,
        speed: { min: 50, max: 100 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 0.6, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        emitting: true,
        quantity: 1,
        frequency: 500
      });

      particles.setDepth(symbol.depth - 2);
      this.activeEffects.push(particles);
    });
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    this.activeEffects.forEach(effect => effect.destroy());
    this.activeEffects = [];
  }
}