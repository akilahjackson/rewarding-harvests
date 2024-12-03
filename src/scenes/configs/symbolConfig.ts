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

// Randomly select 6 symbols for the current game session
const allSymbolKeys = Object.keys(ALL_SYMBOLS);
const selectedKeys = [...allSymbolKeys]
  .sort(() => Math.random() - 0.5)
  .slice(0, 6);

export const SYMBOLS = Object.fromEntries(
  selectedKeys.map(key => [key, ALL_SYMBOLS[key as keyof typeof ALL_SYMBOLS]])
);

// Set multiplier to 10 for all selected symbols
export const SYMBOL_VALUES = Object.fromEntries(
  Object.keys(SYMBOLS).map(key => [SYMBOLS[key as keyof typeof SYMBOLS], 10])
);

export const GRID_SIZE = 6;
export const SYMBOL_SIZE = 128;
export const SPIN_DURATION = 2000;
