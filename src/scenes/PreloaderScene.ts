import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { gameStore } from '../stores/GameStore';
import TitleAnimation from '../components/TitleAnimation';
import { LOADING_MESSAGES } from './constants/loadingMessages';

interface PreloaderSceneData {
  showAuthModal: () => void;
}

export class PreloaderScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image;
  private static bgMusic?: Phaser.Sound.BaseSound;
  private showAuthModal?: (() => void) | undefined;

  private reactContainerId: string = 'react-container';
  private messageContainerId: string = 'loading-messages-container';

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  init(data: PreloaderSceneData): void {
    this.showAuthModal = data.showAuthModal;
    console.log('PreloaderScene: Initialized with data:', data);
  }

  preload(): void {
    console.log('PreloaderScene: Preloading assets...');

    // Preload background image
    this.load.image('preloader-bg', '/images/neon-crop-circles.WEBP');

    // Preload audio files
    const audioFiles = [
      { key: 'background-music', path: '/sounds/background-music.mp3' },
      { key: 'spin-sound', path: '/sounds/spin.mp3' },
      { key: 'win-sound', path: '/sounds/win.mp3' },
      { key: 'big-win-sound', path: '/sounds/big-win.mp3' },
      { key: 'lose-sound', path: '/sounds/lose.mp3' },
    ];

    audioFiles.forEach((audio) => {
      this.load.audio(audio.key, audio.path);
    });

    // Dynamically load all symbols
    this.preloadSymbols();
  }

  private preloadSymbols(): void {
    const symbolsPath = '/images/assets/';
    const symbolFilenames = [
      'avocado',
      'banana',
      'blueberries',
      'broccoli',
      'carrot',
      'cauliflower',
      'cherry',
      'corn',
      'cucumber',
      'eggplant',
      'grapes',
      'lime',
      'pear',
      'plum',
      'pumpkin',
      'strawberry',
      'tomato',
      'watermelon',
    ];

    symbolFilenames.forEach((filename) => {
      const filePath = `${symbolsPath}${filename}.svg`;
      console.log(`PreloaderScene: Loading symbol - ${filename} (${filePath})`);
      this.load.svg(filename, filePath);
      gameStore.symbolKeys.push(filename); // Add to gameStore
    });
  }

  create(): void {
    console.log('PreloaderScene: Assets loaded, creating scene...');

    const { width, height } = this.cameras.main;

    // Set background image
    this.bgImage = this.add
      .image(width / 2, height / 2, 'preloader-bg')
      .setDisplaySize(width, height);

    // Add floating animation to the background
    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Play background music
    this.playBackgroundMusic();

    // Mount React components
    this.mountReactComponents();

    // Emit ready event
    this.emitReadyEvent();
  }

  private playBackgroundMusic(): void {
    if (!PreloaderScene.bgMusic) {
      PreloaderScene.bgMusic = this.sound.add('background-music', {
        volume: 0.5,
        loop: true,
      });
      PreloaderScene.bgMusic.play();
    }
  }

  private mountReactComponents(): void {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      let reactContainer = document.getElementById(this.reactContainerId);
      if (!reactContainer) {
        reactContainer = document.createElement('div');
        reactContainer.id = this.reactContainerId;
        rootElement.appendChild(reactContainer);
      }

      const root = ReactDOM.createRoot(reactContainer);
      root.render(<TitleAnimation />);

      this.createLoadingMessages();
    }
  }

  private createLoadingMessages(): void {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      let messageContainer = document.getElementById(this.messageContainerId);
      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = this.messageContainerId;
        rootElement.appendChild(messageContainer);
      }

      messageContainer.className = 'text-container';

      LOADING_MESSAGES.forEach((message, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.animationDelay = `${index * 2}s`;
        messageDiv.className = 'come2life';
        messageContainer.appendChild(messageDiv);
      });
    }
  }

  private emitReadyEvent(): void {
    console.log('PreloaderScene: Ready, transitioning to WelcomeScene.');
    gameStore.setActiveScene('WelcomeScene');
    this.scene.start('WelcomeScene');
  }

  injectPreloaderCSS(): void {
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        margin: 0;
        overflow: hidden;
      }

      #${this.reactContainerId} {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, 0);
        text-align: center;
        z-index: 1000;
      }

      .text-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #fff;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: bold;
        font-size: 24px;
        z-index: 999;
      }

      .come2life {
        animation: come2life 5s linear infinite;
        opacity: 0;
      }

      @keyframes come2life {
        0% { opacity: 0; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1.4); }
      }
    `;
    document.head.appendChild(style);
  }
}