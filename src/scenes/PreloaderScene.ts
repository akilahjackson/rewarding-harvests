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

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  create() {
    console.log('Creating preloader scene...');
    const { width, height } = this.cameras.main;

    this.circles = [
      { x: width * 0.3, y: height * 0.6, radius: 80, phase: 0, type: 'basic' },
      { x: width * 0.7, y: height * 0.4, radius: 100, phase: Math.PI / 3, type: 'complex' },
      { x: width * 0.5, y: height * 0.7, radius: 120, phase: Math.PI / 2, type: 'advanced' }
    ];

    this.messageText = this.add.text(width / 2, height * 0.2, this.messages[0], {
      fontSize: '24px',
      color: '#F97316',
      fontFamily: 'Space Grotesk'
    });
    this.messageText.setOrigin(0.5);

    this.time.addEvent({
      delay: 2000,
      callback: this.updateMessage,
      callbackScope: this,
      repeat: this.messages.length - 1
    });

    this.time.delayedCall(10000, () => {
      console.log('Loading complete, emitting scene complete event...');
      this.loadingComplete = true;
      this.game.events.emit('sceneComplete');
    });
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

    this.circles.forEach(circle => {
      circle.phase += 0.02;
      const alpha = (Math.sin(circle.phase) + 1) / 2;
      
      graphics.lineStyle(4, 0x0EA5E9, alpha * 0.3);
      graphics.strokeCircle(circle.x, circle.y, circle.radius + 20);
      
      graphics.lineStyle(2, 0xF97316, alpha);
      graphics.strokeCircle(circle.x, circle.y, circle.radius);
      
      graphics.lineStyle(1, 0x0EA5E9, alpha * 0.8);
      
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
