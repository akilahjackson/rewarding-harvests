import { SYMBOLS, SYMBOL_VALUES } from '../configs/symbolConfig';

export const calculateWinnings = (
  grid: string[][],
  betAmount: number,
  multiplier: number
): number => {
  console.log('Calculating winnings for bet:', betAmount, 'multiplier:', multiplier);
  let totalWin = 0;

  // Check rows
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length - 2; col++) {
      const symbol = grid[row][col];
      if (
        symbol === grid[row][col + 1] &&
        symbol === grid[row][col + 2]
      ) {
        const symbolValue = SYMBOL_VALUES[symbol as keyof typeof SYMBOLS];
        const win = betAmount * multiplier * (symbolValue / 100);
        console.log(`Found row match at ${row},${col} with symbol ${symbol}. Win: ${win}`);
        totalWin += win;
      }
    }
  }

  // Check columns
  for (let col = 0; col < grid[0].length; col++) {
    for (let row = 0; row < grid.length - 2; row++) {
      const symbol = grid[row][col];
      if (
        symbol === grid[row + 1][col] &&
        symbol === grid[row + 2][col]
      ) {
        const symbolValue = SYMBOL_VALUES[symbol as keyof typeof SYMBOLS];
        const win = betAmount * multiplier * (symbolValue / 100);
        console.log(`Found column match at ${row},${col} with symbol ${symbol}. Win: ${win}`);
        totalWin += win;
      }
    }
  }

  console.log('Total winnings calculated:', totalWin);
  return totalWin;
};