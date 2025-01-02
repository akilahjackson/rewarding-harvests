import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client"; // React 18 API
import { gameStore } from "../stores/GameStore"; // Centralized GameStore
import TitleAnimation from "../components/TitleAnimation"; // React Component
import { LOADING_MESSAGES } from "./constants/loadingMessages"; // Correct path retained

interface PreloaderSceneData {
  showAuthModal: () => void;
}

export class PreloaderScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image;
  private static bgMusic?: Phaser.Sound.BaseSound; // Static to persist across scenes
  private showAuthModal?: () => void;

  private reactContainerId: string = "react-container";
  private messageContainerId: string = "loading-messages-container";
  private loginButtonId: string = "login-button";

  constructor() {
    super({ key: "PreloaderScene" });
  }

  init(data: PreloaderSceneData) {
    if (data && typeof data.showAuthModal === "function") {
      this.showAuthModal = data.showAuthModal;
      console.log("PreloaderScene: showAuthModal initialized.");
    } else {
      console.error("PreloaderScene: showAuthModal not passed or invalid.");
    }
  }

  preload() {
    console.log("PreloaderScene: Preloading assets...");

    // Preload background image
    this.load.image("preloader-bg", "/images/neon-crop-circles.WEBP");

    // Preload audio files
    const audioFiles = [
      { key: "background-music", path: "/sounds/background-music.mp3" },
      { key: "spin-sound", path: "/sounds/spin.mp3" },
      { key: "win-sound", path: "/sounds/win.mp3" },
      { key: "big-win-sound", path: "/sounds/big-win.mp3" },
      { key: "lose-sound", path: "/sounds/lose.mp3" },
    ];
    audioFiles.forEach((audio) => this.load.audio(audio.key, audio.path));

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
      this.load.svg(filename, filePath);
    });

    // Save symbols to GameStore
    gameStore.setSymbolKeys(symbolFilenames);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Inject Preloader CSS
    this.injectPreloaderCSS();

    // Add background image
    this.bgImage = this.add.image(width / 2, height / 2, "preloader-bg");
    if (this.bgImage) {
      this.bgImage.setDisplaySize(width, height);
      console.log("PreloaderScene: Background image displayed.");
    } else {
      console.error("PreloaderScene: Background image failed to load.");
    }

    // Floating animation for background image
    this.tweens.add({
      targets: this.bgImage,
      y: height / 2 - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Play background music
    this.playBackgroundMusic();

    // Render React TitleAnimation component
    this.mountReactTitle();

    // Add animated loading messages under the title
    this.createLoadingMessages();

    // Add styled login button
    this.createLoginButton();

    // Notify GameStore of the active scene
    gameStore.setActiveScene("PreloaderScene");
  }

  private injectPreloaderCSS(): void {
    const style = document.createElement("style");
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
        width: 100%;
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
        animation: fadeInOut 5s ease-in-out infinite;
        opacity: 0;
      }

      @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
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
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);
  }

  private playBackgroundMusic(): void {
    if (!PreloaderScene.bgMusic) {
      PreloaderScene.bgMusic = this.sound.add("background-music", {
        volume: 0.5,
        loop: true,
      });
      PreloaderScene.bgMusic.play();
    }
  }

  private mountReactTitle(): void {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      let reactContainer = document.getElementById(this.reactContainerId);
      if (!reactContainer) {
        reactContainer = document.createElement("div");
        reactContainer.id = this.reactContainerId;
        rootElement.appendChild(reactContainer);
      }

      const root = ReactDOM.createRoot(reactContainer);
      root.render(React.createElement(TitleAnimation));
    }
  }

  private createLoadingMessages(): void {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      let messageContainer = document.getElementById(this.messageContainerId);
      if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.id = this.messageContainerId;
        rootElement.appendChild(messageContainer);
      }

      messageContainer.className = "text-container";

      LOADING_MESSAGES.forEach((message, index) => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.animationDelay = `${index * 2}s`; // Animation restored
        messageContainer.appendChild(messageDiv);
      });
    }
  }

  private createLoginButton(): void {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      let loginButton = document.getElementById(this.loginButtonId);
      if (!loginButton) {
        loginButton = document.createElement("button");
        loginButton.id = this.loginButtonId;
        loginButton.textContent = "Login to Play";
        rootElement.appendChild(loginButton);
      }

      loginButton.onclick = () => {
        console.log("PreloaderScene: Login button clicked.");
        if (this.showAuthModal) {
          this.hidePreloaderUI(); // Hides preloader UI
          this.showAuthModal();
        }
      };
    }
  }

  private hidePreloaderUI(): void {
    console.log("PreloaderScene: Hiding preloader UI components.");
    const reactContainer = document.getElementById(this.reactContainerId);
    if (reactContainer) reactContainer.remove();

    const messageContainer = document.getElementById(this.messageContainerId);
    if (messageContainer) messageContainer.remove();

    const loginButton = document.getElementById(this.loginButtonId);
    if (loginButton) loginButton.remove();
  }
}
