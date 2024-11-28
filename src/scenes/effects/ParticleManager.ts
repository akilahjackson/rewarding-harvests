import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';

export class ParticleManager {
  private scene: Phaser.Scene;
  private emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('ParticleManager: Initialized');
  }

  createWinParticles(x: number, y: number, radius: number): void {
    console.log('ParticleManager: Creating win particles at', { x, y, radius });
    
    // Create 1-3 glowing neon orbs
    const numOrbs = Phaser.Math.Between(1, 3);
    
    for (let i = 0; i < numOrbs; i++) {
      const particles = this.scene.add.particles(x, y, 'particle');
      
      const emitter = particles.createEmitter({
        x: 0,
        y: 0,
        gravityY: 0,
        quantity: 1,
        frequency: 500,
        lifespan: 2000,
        scale: { start: 0.4, end: 0.1 },
        alpha: { start: 0.8, end: 0 },
        speed: {
          min: -20,
          max: 20
        },
        blendMode: Phaser.BlendModes.ADD,
        tint: 0x4AE54A // Neon green
      });

      this.emitters.push(emitter);
      
      // Create circular motion for each orb
      const angle = (i * 360 / numOrbs) * (Math.PI / 180);
      const orbitRadius = radius * 0.8;
      
      this.scene.tweens.add({
        targets: emitter,
        x: x + Math.cos(angle) * orbitRadius,
        y: y + Math.sin(angle) * orbitRadius,
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  createPaylineParticles(points: { x: number, y: number }[]): void {
    console.log('ParticleManager: Creating payline particles');
    
    points.forEach((point, i) => {
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        
        const particles = this.scene.add.particles(point.x, point.y, 'particle');
        
        const emitter = particles.createEmitter({
          x: 0,
          y: 0,
          gravityY: 0,
          quantity: 1,
          frequency: 200,
          lifespan: 1500,
          scale: { start: 0.3, end: 0 },
          alpha: { start: 0.6, end: 0 },
          speed: {
            min: -10,
            max: 10
          },
          blendMode: Phaser.BlendModes.ADD,
          tint: 0x4AE54A
        });

        this.emitters.push(emitter);

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
      emitter.stop();
      if (emitter.manager) {
        emitter.manager.destroy();
      }
    });
    this.emitters = [];
  }
}