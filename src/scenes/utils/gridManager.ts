import { SYMBOLS, GRID_SIZE, SELECTED_SYMBOLS } from '../configs/symbolConfig';

export const generateRandomSymbol = (): string => {
  const randomIndex = Math.floor(Math.random() * SELECTED_SYMBOLS.length);
  return SELECTED_SYMBOLS[randomIndex];
};

export const createInitialGrid = (): string[][] => {
  console.log('Creating initial grid with selected symbols:', SELECTED_SYMBOLS);
  const grid: string[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = generateRandomSymbol();
    }
  }
  return grid;
};