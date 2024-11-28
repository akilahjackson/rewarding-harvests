import Phaser from 'phaser';

export class MessageManager {
  private scene: Phaser.Scene;
  private messageText: Phaser.GameObjects.Text | null = null;
  private messageBackground: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('MessageManager: Initialized');
  }

  async showMessage(message: string, duration: number = 2000): Promise<void> {
    console.log('MessageManager: Showing message:', message);
    
    if (this.messageText) {
      this.messageText.destroy();
    }
    if (this.messageBackground) {
      this.messageBackground.destroy();
    }

    // Create semi-transparent background
    this.messageBackground = this.scene.add.graphics();
    this.messageBackground.fillStyle(0x000000, 0.7);
    this.messageBackground.fillRect(0, 0, this.scene.cameras.main.width, 100);
    this.messageBackground.setDepth(1000);

    // Create message text with neon effect
    this.messageText = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      50,
      message,
      {
        fontFamily: 'Space Grotesk',
        fontSize: '24px',
        color: '#4AE54A',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
      }
    )
    .setOrigin(0.5)
    .setDepth(1001);

    // Add glow effect
    const glowFX = this.messageText.preFX?.addGlow(0x4AE54A, 0, 0, false, 0.1, 16);
    
    // Animate in
    this.messageText.setAlpha(0);
    this.messageBackground.setAlpha(0);
    
    this.scene.tweens.add({
      targets: [this.messageText, this.messageBackground],
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });

    // Wait for duration
    await new Promise(resolve => this.scene.time.delayedCall(duration, resolve));

    // Animate out
    this.scene.tweens.add({
      targets: [this.messageText, this.messageBackground],
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        if (this.messageText) this.messageText.destroy();
        if (this.messageBackground) this.messageBackground.destroy();
        this.messageText = null;
        this.messageBackground = null;
      }
    });
  }
}