import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  private circles: { x: number; y: number; radius: number; phase: number }[] = [];
  private wheatParticles: { x: number; y: number; angle: number }[] = [];

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  create() {
    console.log('Creating preloader scene...');
    const { width, height } = this.cameras.main;

    // Create wheat field particles
    for (let i = 0; i < 100; i++) {
      this.wheatParticles.push({
        x: Math.random() * width,
        y: height - Math.random() * 100,
        angle: Math.random() * Math.PI / 4 - Math.PI / 8
      });
    }

    // Create crop circles
    this.circles = [
      { x: width * 0.3, y: height * 0.6, radius: 50, phase: 0 },
      { x: width * 0.7, y: height * 0.4, radius: 70, phase: Math.PI / 3 },
      { x: width * 0.5, y: height * 0.7, radius: 60, phase: Math.PI / 2 }
    ];

    // Add loading text
    const loadingText = this.add.text(width / 2, height * 0.2, 'Loading...', {
      fontSize: '32px',
      color: '#4AE54A'
    });
    loadingText.setOrigin(0.5);

    // Simulate loading time (replace with actual asset loading later)
    this.time.delayedCall(3000, () => {
      console.log('Loading complete, starting game...');
      this.scene.start('MainGameScene');
    });
  }

  update(time: number) {
    const graphics = this.add.graphics();
    graphics.clear();

    // Draw wheat stalks
    graphics.lineStyle(2, 0x4AE54A, 0.6);
    this.wheatParticles.forEach(particle => {
      graphics.beginPath();
      graphics.moveTo(particle.x, particle.y);
      graphics.lineTo(
        particle.x + Math.sin(particle.angle + time * 0.001) * 20,
        particle.y - 30
      );
      graphics.strokePath();
    });

    // Draw and animate crop circles
    this.circles.forEach(circle => {
      circle.phase += 0.02;
      const alpha = (Math.sin(circle.phase) + 1) / 2;
      
      // Draw outer glow
      graphics.lineStyle(4, 0x4AE54A, alpha * 0.3);
      graphics.strokeCircle(circle.x, circle.y, circle.radius + 10);
      
      // Draw main circle
      graphics.lineStyle(2, 0x4AE54A, alpha);
      graphics.strokeCircle(circle.x, circle.y, circle.radius);
      
      // Draw inner patterns
      graphics.lineStyle(1, 0x4AE54A, alpha * 0.8);
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        graphics.beginPath();
        graphics.moveTo(circle.x, circle.y);
        graphics.lineTo(
          circle.x + Math.cos(angle) * circle.radius,
          circle.y + Math.sin(angle) * circle.radius
        );
        graphics.strokePath();
      }
    });
  }
}