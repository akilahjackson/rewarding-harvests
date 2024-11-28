import Phaser from 'phaser';

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
  }

  create() {
    console.log('Creating main game scene...');
    const { width, height } = this.cameras.main;
    
    const text = this.add.text(width / 2, height / 2, 'Harvest Slots', {
      fontSize: '32px',
      color: '#4AE54A'
    });
    text.setOrigin(0.5);
  }
}