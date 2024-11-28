import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';

export class ParticleManager {
  private scene: Phaser.Scene;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particles = [];
    console.log('ParticleManager: Initialized');
  }

  createWinParticles(x: number, y: number, radius: number): void {
    console.log('ParticleManager: Creating win particles at', { x, y, radius });
    
    // Create particle manager
    const particles = this.scene.add.particles(0, 0, {
      key: 'star',
      config: {
        x: x,
        y: y,
        speed: { min: 50, max: 100 },
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 1000,
        blendMode: Phaser.BlendModes.ADD,
        quantity: 1,
        tint: COLORS.neonGreen
      }
    });

    this.particles.push(particles);
    
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
        particles.emitters.list[0].setPosition(particleX, particleY);
      }
    });
  }

  createPaylineParticles(points: { x: number, y: number }[]): void {
    console.log('ParticleManager: Creating payline particles');
    
    points.forEach((point, i) => {
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        
        const particles = this.scene.add.particles(0, 0, {
          key: 'star',
          config: {
            x: point.x,
            y: point.y,
            speed: { min: 20, max: 50 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1000,
            blendMode: Phaser.BlendModes.ADD,
            quantity: 1,
            tint: COLORS.neonGreen
          }
        });

        this.particles.push(particles);

        // Animate particles along payline
        this.scene.tweens.add({
          targets: particles.emitters.list[0],
          x: nextPoint.x,
          y: nextPoint.y,
          duration: 2000,
          repeat: -1,
          onUpdate: () => {
            particles.emitters.list[0].emit();
          }
        });
      }
    });
  }

  clearParticles(): void {
    console.log('ParticleManager: Clearing all particles');
    this.particles.forEach(particleManager => {
      particleManager.destroy();
    });
    this.particles = [];
  }
}