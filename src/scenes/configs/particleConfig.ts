import Phaser from 'phaser';

export const createParticleConfig = (x: number, y: number): Phaser.Types.GameObjects.Particles.ParticleEmitterConfig => ({
  scale: { start: 0.5, end: 0 },
  alpha: { start: 0.6, end: 0 },
  speed: 100,
  angle: { min: 0, max: 360 },
  lifespan: 3000,
  frequency: 100,
  quantity: 1,
  blendMode: 'ADD',
  tint: 0xff00ff,
  emitting: false // Ensure particles are not emitting by default
});