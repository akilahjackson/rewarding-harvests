import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import TitleAnimation from './components/TitleAnimation'; // React Component
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

  private reactContainerId: string = 'react-container';

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

    // Set background image
    this.bgImage = this.add
      .image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height);

    // Floating animation for background image
    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Render React TitleAnimation component
    this.mountReactTitle();

    // Loading text
    this.loadingText = this.add
      .text(width / 2, height * 0.3, '', {
        fontFamily: 'Space Grotesk',
        fontSize: `${Math.min(width * 0.03, 24)}px`,
        color: '#4AE54A',
        align: 'center',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Welcome message
    this.messageText = this.add
      .text(width / 2, height * 0.4, 'Reap What You Sow', {
        fontFamily: 'Space Grotesk',
        fontSize: `${Math.min(width * 0.05, 32)}px`,
        color: '#4AE54A',
        align: 'center',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Login button
    this.loginButton = this.add
      .text(width / 2, height * 0.6, 'Login to Play', {
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

  private mountReactTitle(): void {
    const rootElement = document.getElementById('root'); // Ensure the root container exists
    if (rootElement) {
      // Create the React container if it doesn't already exist
      let reactContainer = document.getElementById(this.reactContainerId);
      if (!reactContainer) {
        reactContainer = document.createElement('div');
        reactContainer.id = this.reactContainerId;
        rootElement.appendChild(reactContainer); // Append to root
      }

      // Safely render the React component
      ReactDOM.render(<TitleAnimation />, reactContainer);
    } else {
      console.error('Root element not found!');
    }
  }

  private unmountReactTitle(): void {
    const reactContainer = document.getElementById(this.reactContainerId);
    if (reactContainer) {
      ReactDOM.unmountComponentAtNode(reactContainer); // Unmount React component
      reactContainer.remove(); // Remove the container element
    }
  }

  private startLoadingMessages(): void {
    if (this.messageTimer) this.messageTimer.destroy();

    this.messageTimer = this.time.addEvent({
      delay: 3000,
      callback: this.updateLoadingMessage,
      callbackScope: this,
      loop: true,
    });

    this.updateLoadingMessage();
  }

  private updateLoadingMessage(): void {
    if (this.loadingText) {
      const message = LOADING_MESSAGES[this.messageIndex];
      this.loadingText.setText(message);
      this.messageIndex = (this.messageIndex + 1) % LOADING_MESSAGES.length;
    }
  }

  private initializeBackgroundMusic(): void {
    if (!this.sound.get('background-music')) {
      this.bgMusic = this.sound.add('background-music', { volume: 0.5, loop: true });
      this.bgMusic.play();
    }
  }

  shutdown(): void {
    this.unmountReactTitle(); // Clean up React component on scene shutdown
  }
}
