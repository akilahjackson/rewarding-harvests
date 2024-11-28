import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';

export class ParticleManager {
  private scene: Phaser.Scene;
  private emitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.emitters = new Map();
  }

  createWinParticles(x: number, y: number, radius: number): void {
    const particles = this.scene.add.particles(x, y, 'star', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
      tint: COLORS.neonGreen
    });

    this.emitters.set(`win-${x}-${y}`, particles);
    
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
        particles.setPosition(particleX, particleY);
        particles.emitParticle();
      }
    });
  }

  createPaylineParticles(points: { x: number, y: number }[]): void {
    points.forEach((point, i) => {
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        const particles = this.scene.add.particles(point.x, point.y, 'star', {
          speed: { min: 20, max: 50 },
          scale: { start: 0.1, end: 0 },
          alpha: { start: 0.6, end: 0 },
          lifespan: 1000,
          blendMode: Phaser.BlendModes.ADD,
          tint: COLORS.neonGreen,
          emitting: false
        });

        this.emitters.set(`payline-${i}`, particles);

        // Animate particles along payline
        this.scene.tweens.add({
          targets: particles,
          x: nextPoint.x,
          y: nextPoint.y,
          duration: 2000,
          repeat: -1,
          onUpdate: () => {
            particles.emitParticle();
          }
        });
      }
    });
  }

  clearParticles(): void {
    this.emitters.forEach(emitter => {
      emitter.destroy();
    });
    this.emitters.clear();
  }
}