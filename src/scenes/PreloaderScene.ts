import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  private circles: { x: number; y: number; radius: number; phase: number; type: string }[] = [];
  private messages: string[] = [
    "Initiating crop circle colonization sequence...",
    "Establishing geometric resonance patterns...",
    "Calibrating interdimensional harvest protocols...",
    "Synchronizing with celestial agricultural grid...",
    "Preparing for cosmic cultivation..."
  ];
  private currentMessage: number = 0;
  private messageText?: Phaser.GameObjects.Text;
  private loadingComplete: boolean = false;
  private progressText?: Phaser.GameObjects.Text;
  private progress: number = 0;
  private emitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private bgMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Load audio file with correct path and key
    this.load.audio('ambient', ['/assets/ambient.mp3']);
    
    // Show loading progress
    this.load.on('progress', (value: number) => {
      this.progress = Math.floor(value * 100);
      if (this.progressText) {
        this.progressText.setText(`${this.progress}%`);
      }
    });
  }

  create() {
    console.log('Creating preloader scene...');
    const { width, height } = this.cameras.main;

    // Initialize background music after loading
    try {
      this.bgMusic = this.sound.add('ambient', { loop: true, volume: 0.3 });
      this.bgMusic.play();
    } catch (error) {
      console.error('Error playing background music:', error);
    }

    // Initialize particle emitter
    this.emitter = this.add.particles(0, 0, {
      frames: ['__WHITE'], // Changed 'frame' to 'frames'
      lifespan: 2000,
      speed: { min: 50, max: 100 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      emitting: false
    });

    this.circles = [
      { x: width * 0.3, y: height * 0.6, radius: 80, phase: 0, type: 'basic' },
      { x: width * 0.7, y: height * 0.4, radius: 100, phase: Math.PI / 3, type: 'complex' },
      { x: width * 0.5, y: height * 0.7, radius: 120, phase: Math.PI / 2, type: 'advanced' }
    ];

    // Initialize progress text
    this.progressText = this.add.text(width / 2, height * 0.85, '0%', {
      fontSize: '32px',
      color: '#4AE54A',
      fontFamily: 'Space Grotesk'
    }).setOrigin(0.5);

    this.messageText = this.add.text(width / 2, height * 0.2, this.messages[0], {
      fontSize: '24px',
      color: '#F97316',
      fontFamily: 'Space Grotesk'
    }).setOrigin(0.5);

    // Update messages periodically
    this.time.addEvent({
      delay: 2000,
      callback: this.updateMessage,
      callbackScope: this,
      repeat: this.messages.length - 1
    });

    // Simulate loading progress
    this.time.addEvent({
      delay: 100,
      callback: this.updateProgress,
      callbackScope: this,
      repeat: 100
    });
  }

  updateProgress() {
    if (this.progress < 100) {
      this.progress++;
      if (this.progressText) {
        this.progressText.setText(`${this.progress}%`);
      }
    } else if (!this.loadingComplete) {
      this.loadingComplete = true;
      this.game.events.emit('sceneComplete');
    }
  }

  updateMessage() {
    if (this.messageText && !this.loadingComplete) {
      this.currentMessage = (this.currentMessage + 1) % this.messages.length;
      this.messageText.setText(this.messages[this.currentMessage]);
    }
  }

  update() {
    if (this.loadingComplete) return;

    const graphics = this.add.graphics();
    graphics.clear();

    this.circles.forEach((circle, index) => {
      circle.phase += 0.02;
      const alpha = (Math.sin(circle.phase) + 1) / 2;
      
      // Neon glow effect
      const glowColor = index === 0 ? 0xF97316 : index === 1 ? 0x4AE54A : 0x0EA5E9;
      
      // Outer glow
      graphics.lineStyle(8, glowColor, alpha * 0.3);
      graphics.strokeCircle(circle.x, circle.y, circle.radius + 20);
      
      // Main circle
      graphics.lineStyle(3, glowColor, alpha);
      graphics.strokeCircle(circle.x, circle.y, circle.radius);
      
      // Inner patterns
      graphics.lineStyle(2, glowColor, alpha * 0.8);
      
      // Emit particles
      if (this.emitter && Math.random() > 0.95) {
        this.emitter.setPosition(
          circle.x + (Math.random() - 0.5) * circle.radius,
          circle.y + (Math.random() - 0.5) * circle.radius
        );
        this.emitter.explode(1);
      }

      // Draw geometric patterns based on circle type
      if (circle.type === 'basic') {
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
      } else if (circle.type === 'complex') {
        for (let r = circle.radius * 0.2; r <= circle.radius; r += circle.radius * 0.2) {
          graphics.strokeCircle(circle.x, circle.y, r);
        }
      } else {
        for (let i = 0; i < 360; i += 30) {
          const angle = (i * Math.PI) / 180;
          const r = (circle.radius * i) / 360;
          graphics.beginPath();
          graphics.moveTo(circle.x, circle.y);
          graphics.lineTo(
            circle.x + Math.cos(angle) * r,
            circle.y + Math.sin(angle) * r
          );
          graphics.strokePath();
        }
      }
    });
  }
}
