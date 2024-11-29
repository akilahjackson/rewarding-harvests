import Phaser from 'phaser';
import { GRID_SIZE, SYMBOL_SIZE } from '../configs/symbolConfig';

export class GridManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  calculateGridDimensions(width: number, height: number) {
    const padding = Math.min(width, height) * 0.15;
    const gridPadding = Math.min(width, height) * 0.04;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    
    const cellSize = Math.min(
      (availableWidth - (gridPadding * (GRID_SIZE - 1))) / GRID_SIZE,
      (availableHeight - (gridPadding * (GRID_SIZE - 1))) / GRID_SIZE
    );

    const startX = (width - ((cellSize + gridPadding) * (GRID_SIZE - 1))) / 2;
    const startY = (height - ((cellSize + gridPadding) * (GRID_SIZE - 1))) / 2;
    const baseScale = cellSize / SYMBOL_SIZE;

    return {
      width,
      height,
      cellSize,
      startX,
      startY,
      baseScale,
      gridPadding
    };
  }
}