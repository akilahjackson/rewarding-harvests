import { SYMBOLS, GRID_SIZE } from '../configs/symbolConfig';

export const generateRandomSymbol = (): string => {
  const symbolKeys = Object.values(SYMBOLS);
  const randomIndex = Math.floor(Math.random() * symbolKeys.length);
  return symbolKeys[randomIndex];
};

export const createInitialGrid = (): string[][] => {
  console.log('Creating initial grid');
  const grid: string[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = generateRandomSymbol();
    }
  }
  return grid;
};