import Phaser from 'phaser';
import { LOADING_MESSAGES } from './constants/loadingMessages';

interface PreloaderSceneData {
  showAuthModal: () => void;
}

export class PreloaderScene extends Phaser.Scene {
  private loadingText?: Phaser.GameObjects.Text;
  private messageText?: Phaser.GameObjects.Text;
  private bgImage?: Phaser.GameObjects.Image;
  private bgMusic?: Phaser.Sound.BaseSound;
  private loginButton?: Phaser.GameObjects.Text;
  private messageIndex: number = 0;
  private messageTimer?: Phaser.Time.TimerEvent;
  private showAuthModal?: () => void;

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  init(data: PreloaderSceneData) {
    this.showAuthModal = data.showAuthModal;
  }

  preload() {
    this.load.image('preloader-bg', '/images/neon-crop-circles.WEBP');

    const audioFiles = [
      { key: 'background-music', path: '/sounds/background-music.mp3' },
      { key: 'spin-sound', path: '/sounds/spin.mp3' },
      { key: 'win-sound', path: '/sounds/win.mp3' },
      { key: 'big-win-sound', path: '/sounds/big-win.mp3' },
      { key: 'lose-sound', path: '/sounds/lose.mp3' },
    ];

    audioFiles.forEach((audio) => this.load.audio(audio.key, audio.path));

    this.load.on('complete', () => this.initializeBackgroundMusic());
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.bgImage = this.add.image(width / 2, height / 2, 'preloader-bg').setDisplaySize(width, height);

    // Floating animation
    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Loading text
    this.loadingText = this.add.text(width / 2, height * 0.3, '', {
      fontFamily: 'Space Grotesk',
      fontSize: `${Math.min(width * 0.03, 24)}px`,
      color: '#4AE54A',
      align: 'center',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Welcome message
    this.messageText = this.add.text(width / 2, height * 0.4, 'Welcome to Harvest Haven', {
      fontFamily: 'Space Grotesk',
      fontSize: `${Math.min(width * 0.05, 32)}px`,
      color: '#4AE54A',
      align: 'center',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);

    // Login button
    this.loginButton = this.add.text(width / 2, height * 0.6, 'Login to Play', {
      fontFamily: 'Space Grotesk',
      fontSize: `${Math.min(width * 0.04, 24)}px`,
      color: '#FFF',
      backgroundColor: '#FF6B35',
      padding: { x: 20, y: 10 },
      align: 'center',
      stroke: '#000',
      strokeThickness: 3,
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      if (this.showAuthModal) {
        this.showAuthModal();
      }
    });

    // Show loading messages
    this.startLoadingMessages();

    // Fade in texts
    this.tweens.add({
      targets: [this.messageText, this.loginButton],
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
    });
  }

  private startLoadingMessages() {
    if (this.messageTimer) this.messageTimer.destroy();

    this.messageTimer = this.time.addEvent({
      delay: 3000,
      callback: this.updateLoadingMessage,
      callbackScope: this,
      loop: true,
    });

    this.updateLoadingMessage();
  }

  private updateLoadingMessage() {
    if (this.loadingText) {
      const message = LOADING_MESSAGES[this.messageIndex];
      this.loadingText.setText(message);
      this.messageIndex = (this.messageIndex + 1) % LOADING_MESSAGES.length;
    }
  }

  private initializeBackgroundMusic() {
    if (!this.sound.get('background-music')) {
      this.bgMusic = this.sound.add('background-music', { volume: 0.5, loop: true });
      this.bgMusic.play();
    }
  }
}
