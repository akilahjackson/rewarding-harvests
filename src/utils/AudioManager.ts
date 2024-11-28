class AudioManager {
  private static instance: AudioManager;
  private bgMusic: HTMLAudioElement;
  private spinSound: HTMLAudioElement;
  private winSound: HTMLAudioElement;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

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

  async initializeAudio() {
    if (this.isInitialized) return;
    
    try {
      // Create a short silent audio context to initialize audio
      const audioContext = new AudioContext();
      await audioContext.resume();
      this.isInitialized = true;
      
      if (!this.isMuted) {
        await this.bgMusic.play();
      }
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  }

  async playBackgroundMusic() {
    if (!this.isInitialized) {
      console.log('Audio not initialized yet. Waiting for user interaction.');
      return;
    }

    try {
      if (!this.isMuted) {
        await this.bgMusic.play();
      }
    } catch (error) {
      console.log('Failed to play background music:', error);
    }
  }

  async playSpinSound() {
    if (!this.isMuted && this.isInitialized) {
      try {
        await this.spinSound.play();
      } catch (error) {
        console.log('Failed to play spin sound:', error);
      }
    }
  }

  async playWinSound() {
    if (!this.isMuted && this.isInitialized) {
      try {
        await this.winSound.play();
      } catch (error) {
        console.log('Failed to play win sound:', error);
      }
    }
  }

  async toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgMusic.pause();
    } else if (this.isInitialized) {
      try {
        await this.bgMusic.play();
      } catch (error) {
        console.log('Failed to resume background music:', error);
      }
    }
    return this.isMuted;
  }
}

export default AudioManager;