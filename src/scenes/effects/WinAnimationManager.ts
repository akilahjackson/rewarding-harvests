import Phaser from 'phaser';
import { COLORS } from '../configs/styleConfig';
import { ParticleManager } from './ParticleManager';

export class WinAnimationManager {
  private scene: Phaser.Scene;
  private particleManager: ParticleManager;
  private winCircles: Phaser.GameObjects.Graphics[];
  private symbolScale: number = 1.05;
  private flashTweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.particleManager = new ParticleManager(scene);
    this.winCircles = [];
    console.log('WinAnimationManager: Initialized');
  }

  createWinAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    console.log('WinAnimationManager: Creating win animation for positions:', positions);
    
    this.clearPreviousAnimations();

    positions.forEach(([row, col]) => {
      const symbol = symbols[row][col];
      const circle = this.scene.add.graphics();
      
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
          circle.lineStyle(3, COLORS.neonGreen, 0.8);
          circle.strokeCircle(symbol.x, symbol.y, target.radius);
          
          // Add inner glow using 3 circles with decreasing alpha
          const glowSteps = [
            { alpha: 0.2, scale: 1 },
            { alpha: 0.1, scale: 0.7 },
            { alpha: 0.05, scale: 0.4 }
          ];

          glowSteps.forEach(step => {
            circle.fillStyle(COLORS.neonGreen, step.alpha);
            circle.fillCircle(
              symbol.x, 
              symbol.y, 
              target.radius * step.scale
            );
          });
        }
      });

      // Ensure circle is behind the symbol
      circle.setDepth(symbol.depth - 1);
      this.winCircles.push(circle);
      this.particleManager.createWinParticles(symbol.x, symbol.y, radius);
    });

    // Create payline animation if there are multiple winning positions
    if (positions.length > 1) {
      this.createPaylineAnimation(positions, symbols);
    }
  }

  private createPaylineAnimation(positions: number[][], symbols: Phaser.GameObjects.Text[][]): void {
    const points = positions.map(([row, col]) => ({
      x: symbols[row][col].x,
      y: symbols[row][col].y
    }));

    const graphics = this.scene.add.graphics();
    
    this.scene.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 1500,
      onUpdate: (tween) => {
        graphics.clear();
        graphics.lineStyle(3, COLORS.neonGreen, 0.8);
        
        // Draw connecting lines with glow effect
        graphics.lineStyle(5, COLORS.neonGreen, 0.3);
        this.drawPayline(graphics, points);
        graphics.lineStyle(3, COLORS.neonGreen, 0.5);
        this.drawPayline(graphics, points);
        graphics.lineStyle(2, COLORS.neonGreen, 0.8);
        this.drawPayline(graphics, points);
      },
      onComplete: () => {
        this.particleManager.createPaylineParticles(points);
      }
    });

    this.winCircles.push(graphics);
  }

  private drawPayline(graphics: Phaser.GameObjects.Graphics, points: { x: number, y: number }[]): void {
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.strokePath();
  }

  clearPreviousAnimations(): void {
    console.log('WinAnimationManager: Clearing previous animations');
    this.winCircles.forEach(circle => circle.destroy());
    this.winCircles = [];
    this.flashTweens.forEach(tween => tween.stop());
    this.flashTweens = [];
    this.particleManager.clearParticles();
  }
}