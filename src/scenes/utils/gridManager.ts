import { GRID_SIZE, SELECTED_SYMBOLS } from '../configs/symbolConfig';

export const generateRandomSymbol = (): string => {
  const randomIndex = Math.floor(Math.random() * SELECTED_SYMBOLS.length);
  const symbol = SELECTED_SYMBOLS[randomIndex];
  console.log('Generated random symbol:', symbol);
  return symbol;
};

export const createInitialGrid = (): string[][] => {
  console.log('Creating initial grid with all symbols:', SELECTED_SYMBOLS);
  const grid: string[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = generateRandomSymbol();
    }
  }
  console.log('Initial grid created:', grid);
  return grid;
};