export const ALL_SYMBOLS = {
  AVOCADO: 'avocado',
  BANANA: 'banana',
  BLUEBERRIES: 'blueberries',
  BROCCOLI: 'broccoli',
  CARROT: 'carrot',
  CAULIFLOWER: 'cauliflower',
  CHERRY: 'cherry',
  CORN: 'corn',
  CUCUMBER: 'cucumber',
  EGGPLANT: 'eggplant',
  GRAPES: 'grapes',
  LIME: 'lime',
  PEAR: 'pear',
  PLUM: 'plum',
  PUMPKIN: 'pumpkin',
  STRAWBERRY: 'strawberry',
  TOMATO: 'tomato',
  WATERMELON: 'watermelon'
};

// Use all symbols for the game
const allSymbolKeys = Object.keys(ALL_SYMBOLS);
export const SYMBOLS = Object.fromEntries(
  allSymbolKeys.map(key => [key, ALL_SYMBOLS[key as keyof typeof ALL_SYMBOLS]])
);

// Set multiplier to 10 for all symbols
export const SYMBOL_VALUES = Object.fromEntries(
  Object.keys(SYMBOLS).map(key => [SYMBOLS[key as keyof typeof SYMBOLS], 10])
);

export const GRID_SIZE = 6;
export const SYMBOL_SIZE = 128; // Changed from 256 to 128
export const SPIN_DURATION = 2000;

// Export all symbols array for use in gridManager
export const SELECTED_SYMBOLS = Object.values(SYMBOLS);

console.log('Initialized symbols:', SELECTED_SYMBOLS);