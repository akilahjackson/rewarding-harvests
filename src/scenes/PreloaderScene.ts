import Phaser from 'phaser';
import { LOADING_MESSAGES } from './constants/loadingMessages';
import { createParticleConfig } from './configs/particleConfig';
import { CircleConfig, createCircleConfigs } from './configs/circleConfig';

export class PreloaderScene extends Phaser.Scene {
  private circles: CircleConfig[] = [];
  private currentMessage: number = 0;
  private messageText?: Phaser.GameObjects.Text;
  private loadingComplete: boolean = false;
  private progressText?: Phaser.GameObjects.Text;
  private progress: number = 0;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  private bgMusic?: Phaser.Sound.BaseSound;

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

    // Initialize text elements
    this.messageText = this.add.text(width / 2, height * 0.2, LOADING_MESSAGES[0], {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#39ff14',
      align: 'center'
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, height * 0.85, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Initialize particles
    try {
      this.particles = this.add.particles(width / 2, height / 2, 'particle');
      this.particles.createEmitter(createParticleConfig(width / 2, height / 2));
      console.log('PreloaderScene: Particle system initialized');
    } catch (error) {
      console.error('PreloaderScene: Particle system error:', error);
    }

    // Initialize circles
    this.circles = createCircleConfigs(width, height);
    console.log('PreloaderScene: Circles initialized:', this.circles.length);

    // Start message cycling
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
      this.messageText.setText(LOADING_MESSAGES[this.currentMessage]);
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