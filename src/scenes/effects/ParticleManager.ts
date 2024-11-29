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
      emitting: false, // Start as not emitting
      quantity: 1,
      frequency: 150
    });

    particles.setDepth(-1);
    this.particleSystems.push(particles);
    
    // Start emitting after a short delay
    this.scene.time.delayedCall(100, () => {
      particles.start();
    });
    
    // Stop and destroy after animation
    this.scene.time.delayedCall(2000, () => {
      particles.stop();
      this.removeParticleSystem(particles);
    });
  }

  private removeParticleSystem(particles: Phaser.GameObjects.Particles.ParticleEmitter): void {
    const index = this.particleSystems.indexOf(particles);
    if (index > -1) {
      this.particleSystems.splice(index, 1);
      particles.destroy();
    }
  }

  clearParticles(): void {
    console.log('ParticleManager: Clearing all particles');
    this.particleSystems.forEach(particles => {
      particles.stop();
      particles.destroy();
    });
    this.particleSystems = [];
  }
}