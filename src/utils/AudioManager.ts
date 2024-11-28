class AudioManager {
  private static instance: AudioManager;
  private bgMusic: HTMLAudioElement;
  private spinSound: HTMLAudioElement;
  private winSound: HTMLAudioElement;
  private isMuted: boolean = false;

  private constructor() {
    this.bgMusic = new Audio('/sounds/background-music.mp3');
    this.bgMusic.loop = true;
    this.spinSound = new Audio('/sounds/spin.mp3');
    this.winSound = new Audio('/sounds/win.mp3');
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  playBackgroundMusic() {
    if (!this.isMuted) {
      this.bgMusic.play();
    }
  }

  playSpinSound() {
    if (!this.isMuted) {
      this.spinSound.play();
    }
  }

  playWinSound() {
    if (!this.isMuted) {
      this.winSound.play();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgMusic.pause();
    } else {
      this.bgMusic.play();
    }
    return this.isMuted;
  }
}

export default AudioManager;