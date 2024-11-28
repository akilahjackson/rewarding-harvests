import Phaser from 'phaser';
import { COLORS, TEXT_STYLE } from './configs/styleConfig';
import { createParticleConfig, createCircleConfig } from './configs/animationConfig';
import { LOADING_MESSAGES } from './configs/messageConfig';

export class PreloaderScene extends Phaser.Scene {
  private messageText?: Phaser.GameObjects.Text;
  private progressText?: Phaser.GameObjects.Text;
  private currentMessage: number = 0;
  private progress: number = 0;
  private loadingComplete: boolean = false;
  private cropCircle?: Phaser.GameObjects.Graphics;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor() {
    super({ key: 'PreloaderScene' });
    console.log('PreloaderScene: Constructor initialized');
  }

  preload() {
    console.log('PreloaderScene: Starting preload');
    
    this.load.on('progress', (value: number) => {
      this.progress = Math.floor(value * 100);
      console.log(`PreloaderScene: Loading progress: ${this.progress}%`);
      if (this.progressText) {
        this.progressText.setText(`${this.progress}%`);
      }
    });

    this.load.on('complete', () => {
      console.log('PreloaderScene: Asset loading complete');
    });

    this.load.on('loaderror', (fileObj: any) => {
      console.error('PreloaderScene: Asset loading error:', fileObj);
    });
  }

  create() {
    console.log('PreloaderScene: Starting create phase');
    const { width, height } = this.cameras.main;

    // Initialize text
    this.messageText = this.add.text(width / 2, height * 0.2, LOADING_MESSAGES[0], TEXT_STYLE)
      .setOrigin(0.5)
      .setAlpha(0);

    this.progressText = this.add.text(width / 2, height * 0.85, '0%', TEXT_STYLE)
      .setOrigin(0.5);

    // Create crop circle
    this.cropCircle = this.add.graphics();
    const circleConfig = createCircleConfig(width / 2, height / 2, 100);
    
    // Animate crop circle
    this.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 2000,
      onUpdate: (tween) => {
        this.cropCircle?.clear();
        this.cropCircle?.lineStyle(circleConfig.lineStyle.width, circleConfig.lineStyle.color);
        this.cropCircle?.strokeCircle(
          circleConfig.x,
          circleConfig.y,
          circleConfig.radius * tween.getValue()
        );
      }
    });

    // Setup particles
    this.particles = this.add.particles(0, 0, 'particle', createParticleConfig(this));
    
    // Cycle messages
    this.time.addEvent({
      delay: 2000,
      callback: this.updateMessage,
      callbackScope: this,
      loop: true
    });

    // Update progress
    this.time.addEvent({
      delay: 50,
      callback: this.updateProgress,
      callbackScope: this,
      loop: true
    });

    console.log('PreloaderScene: Scene setup complete');
  }

  private updateMessage() {
    if (this.messageText && !this.loadingComplete) {
      this.currentMessage = (this.currentMessage + 1) % LOADING_MESSAGES.length;
      
      this.tweens.add({
        targets: this.messageText,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (this.messageText) {
            this.messageText.setText(LOADING_MESSAGES[this.currentMessage]);
            this.tweens.add({
              targets: this.messageText,
              alpha: 1,
              duration: 500
            });
          }
        }
      });
    }
  }

  private updateProgress() {
    if (this.progress < 100) {
      this.progress++;
      if (this.progressText) {
        this.progressText.setText(`${this.progress}%`);
      }
    } else if (!this.loadingComplete) {
      this.loadingComplete = true;
      console.log('PreloaderScene: Loading complete, emitting scene complete event');
      this.game.events.emit('sceneComplete');
    }
  }
}