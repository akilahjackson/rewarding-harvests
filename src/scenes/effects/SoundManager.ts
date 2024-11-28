import Phaser from 'phaser';

export class SoundManager {
  private scene: Phaser.Scene;
  private spinSound: Phaser.Sound.BaseSound;
  private winSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.spinSound = this.scene.sound.add('spin-sound', { volume: 0.5 });
    this.winSound = this.scene.sound.add('win-sound', { volume: 0.7 });
  }

  playSpinSound() {
    this.spinSound.play();
  }

  playWinSound() {
    this.winSound.play();
  }

  toggleMute(isMuted: boolean) {
    this.scene.sound.mute = isMuted;
  }
}