import Phaser from 'phaser';

export const createParticleConfig = (x: number, y: number): Phaser.Types.GameObjects.Particles.ParticleEmitterConfig => ({
  lifespan: 2000,
  speed: { min: 20, max: 50 },
  scale: { start: 0.2, end: 0 },
  alpha: { start: 0.6, end: 0 },
  blendMode: Phaser.BlendModes.ADD,
  emitting: true,
  quantity: 1,
  emitZone: { 
    type: 'random', 
    source: new Phaser.Geom.Circle(0, 0, 50)
  }
});