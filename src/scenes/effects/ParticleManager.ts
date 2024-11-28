import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';

export class ParticleManager {
  private scene: Phaser.Scene;
  private emitters: Phaser.GameObjects.Particles.ParticleEmitter[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.emitters = [];
    console.log('ParticleManager: Initialized');
  }

  createWinParticles(x: number, y: number, radius: number): void {
    console.log('ParticleManager: Creating win particles at', { x, y, radius });
    
    const emitter = this.scene.add.particles(x, y, 'star', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      blendMode: Phaser.BlendModes.ADD,
      frequency: 100,
      quantity: 1,
      tint: COLORS.neonGreen
    });

    this.emitters.push(emitter);
    
    // Create circular motion
    this.scene.tweens.add({
      targets: { angle: 0 },
      angle: 360,
      duration: 2000,
      repeat: -1,
      onUpdate: (tween) => {
        const angle = Phaser.Math.DegToRad(tween.getValue());
        const particleX = x + Math.cos(angle) * radius;
        const particleY = y + Math.sin(angle) * radius;
        emitter.setPosition(particleX, particleY);
      }
    });
  }

  createPaylineParticles(points: { x: number, y: number }[]): void {
    console.log('ParticleManager: Creating payline particles');
    
    points.forEach((point, i) => {
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        
        const emitter = this.scene.add.particles(point.x, point.y, 'star', {
          speed: { min: 20, max: 50 },
          scale: { start: 0.1, end: 0 },
          alpha: { start: 0.6, end: 0 },
          lifespan: 1000,
          blendMode: Phaser.BlendModes.ADD,
          frequency: 100,
          quantity: 1,
          tint: COLORS.neonGreen
        });

        this.emitters.push(emitter);

        // Animate particles along payline
        this.scene.tweens.add({
          targets: emitter,
          x: nextPoint.x,
          y: nextPoint.y,
          duration: 2000,
          repeat: -1
        });
      }
    });
  }

  clearParticles(): void {
    console.log('ParticleManager: Clearing all particles');
    this.emitters.forEach(emitter => {
      emitter.destroy();
    });
    this.emitters = [];
  }
}