import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 API
import { gameStore } from '../stores/GameStore'; // GameStore import
import TitleAnimation from '../components/TitleAnimation'; // React Component
import { LOADING_MESSAGES } from './constants/loadingMessages';

interface PreloaderSceneData {
  showAuthModal: () => void;
}

export class PreloaderScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image;
  private static bgMusic?: Phaser.Sound.BaseSound; // Static to persist across scenes
  private showAuthModal?: () => void;

  private reactContainerId: string = 'react-container';
  private messageContainerId: string = 'loading-messages-container';
  private loginButtonId: string = 'login-button';

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  init(data: PreloaderSceneData) {
    this.showAuthModal = data.showAuthModal;
  }

  preload() {
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
    audioFiles.forEach((audio) => this.load.audio(audio.key, audio.path));

    // Preload symbols
    this.preloadSymbols();
  }

  private preloadSymbols(): void {
    const symbolsPath = "/images/assets/";
    const symbolFilenames = [
      "avocado",
      "banana",
      "blueberries",
      "broccoli",
      "carrot",
      "cauliflower",
      "cherry",
      "corn",
      "cucumber",
      "eggplant",
      "grapes",
      "lime",
      "pear",
      "plum",
      "pumpkin",
      "strawberry",
      "tomato",
      "watermelon",
    ];

    symbolFilenames.forEach((filename) => {
      const filePath = `${symbolsPath}${filename}.svg`;
      console.log(`PreloaderScene: Preloading symbol - ${filename}`);
      this.load.svg(filename, filePath); // Load SVG symbol
      gameStore.symbolKeys.push(filename); // Store symbol keys in the GameStore
    });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Dynamically inject Preloader CSS
    this.injectPreloaderCSS();

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

    // Play background music
    this.playBackgroundMusic();

    // Render React TitleAnimation component
    this.mountReactTitle();

    // Add animated loading messages under the title
    this.createLoadingMessages();

    // Add styled login button
    this.createLoginButton();

    // Emit "ready" event and notify GameStore
    this.emitReadyEvent();
  }

  private emitReadyEvent() {
    // Emit the "ready" event to signal the end of preloading
    this.time.delayedCall(2000, () => {
      console.log('PreloaderScene: Preloading complete, emitting ready event.');
      this.events.emit('ready');

      // Notify GameStore about scene transition
      gameStore.setActiveScene('WelcomeScene');
    });
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

  private mountReactTitle(): void {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      let reactContainer = document.getElementById(this.reactContainerId);
      if (!reactContainer) {
        reactContainer = document.createElement('div');
        reactContainer.id = this.reactContainerId;
        rootElement.appendChild(reactContainer);
      }

      const root = ReactDOM.createRoot(reactContainer);
      root.render(React.createElement(TitleAnimation));
    } else {
      console.error('Root element not found!');
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
        messageDiv.style.animationDelay = `${index * 2}s`; // Stagger animations
        messageContainer.appendChild(messageDiv);
      });
    }
  }

  private createLoginButton(): void {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      let loginButton = document.getElementById(this.loginButtonId);
      if (!loginButton) {
        loginButton = document.createElement('button');
        loginButton.id = this.loginButtonId;
        loginButton.textContent = 'Login to Play';
        rootElement.appendChild(loginButton);
      }

      loginButton.className = 'login-button';
      loginButton.onclick = () => {
        if (this.showAuthModal) {
          this.showAuthModal();
        }

        this.cleanupDOMElements();
      };
    }
  }

  private injectPreloaderCSS(): void {
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
        transform: translate(-50%, 0); /* Horizontally center */
        text-align: center;
        z-index: 1000;
        width: 100%; /* Ensure it doesn't go off-canvas */
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

      .text-container > div {
        animation: come2life 5s linear infinite;
        opacity: 0;
      }

      #${this.loginButtonId} {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Space Grotesk', sans-serif;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        background-color: #4ae54a;
        padding: 12px 24px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-transform: uppercase;
        transition: background-color 0.3s ease;
        z-index: 1000;
      }

      #${this.loginButtonId}:hover {
        background-color: #3bb13b;
      }

      @keyframes come2life {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
        }
        100% {
          opacity: 0;
          transform: scale(1.4);
        }
      }
    `;
    document.head.appendChild(style);
  }

  shutdown(): void {
    // Cleanup when transitioning to another scene
    this.cleanupDOMElements();
  }

  private cleanupDOMElements(): void {
    const reactContainer = document.getElementById(this.reactContainerId);
    if (reactContainer) {
      const root = ReactDOM.createRoot(reactContainer);
      root.unmount();
      reactContainer.remove();
    }

    const messageContainer = document.getElementById(this.messageContainerId);
    if (messageContainer) {
      messageContainer.remove();
    }

    const loginButton = document.getElementById(this.loginButtonId);
    if (loginButton) {
      loginButton.remove();
    }
  }
}
