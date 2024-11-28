import Phaser from 'phaser';

export class ParticleManager {
  private scene: Phaser.Scene;
  private particleSystems: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('ParticleManager: Initialized');
  }

  createWinParticles(x: number, y: number, radius: number): void {
    console.log('ParticleManager: Creating win particles at', { x, y, radius });
    
    const particles = this.scene.add.particles(x, y, 'particle', {
      lifespan: 2000,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: true,
      quantity: 1,
      frequency: 150, // Reduced frequency for fewer particles
      rotate: { min: 0, max: 360 }
    });

    // Set particle depth to be behind symbols
    particles.setDepth(-1);
    this.particleSystems.push(particles);
  }

  createPaylineParticles(points: { x: number, y: number }[]): void {
    console.log('ParticleManager: Creating payline particles');
    
    points.forEach((point, i) => {
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        
        const particles = this.scene.add.particles(point.x, point.y, 'particle', {
          lifespan: 1500,
          speed: { min: 30, max: 60 },
          scale: { start: 0.3, end: 0 },
          alpha: { start: 0.6, end: 0 },
          blendMode: Phaser.BlendModes.ADD,
          emitting: true,
          quantity: 1,
          frequency: 200, // Reduced frequency for fewer particles
          rotate: { min: 0, max: 360 }
        });

        // Set particle depth to be behind symbols
        particles.setDepth(-1);
        this.particleSystems.push(particles);

        this.scene.tweens.add({
          targets: particles,
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
    this.particleSystems.forEach(particles => {
      particles.destroy();
    });
    this.particleSystems = [];
  }
}