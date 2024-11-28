import Phaser from 'phaser';
import { COLORS } from './styleConfig';

export const createParticleConfig = (scene: Phaser.Scene): Phaser.Types.GameObjects.Particles.ParticleEmitterConfig => ({
  lifespan: 3000,
  speed: { min: 50, max: 100 },
  scale: { start: 0.2, end: 0 },
  alpha: { start: 0.6, end: 0 },
  blendMode: Phaser.BlendModes.ADD,
  quantity: 1,
  tint: [COLORS.neonGreen, COLORS.neonPink]
});

export const createCircleConfig = (x: number, y: number, radius: number) => ({
  x,
  y,
  radius,
  lineStyle: {
    width: 3,
    color: COLORS.neonGreen,
    alpha: 1
  }
});