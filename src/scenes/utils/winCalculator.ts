import { SYMBOLS, SYMBOL_VALUES } from '../configs/symbolConfig';

interface WinningLine {
  positions: number[][];
  symbol: string;
  count: number;
}

export const findWinningLines = (grid: string[][]): WinningLine[] => {
  const winningLines: WinningLine[] = [];
  const size = grid.length;

  // Check horizontal lines
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 2; col++) {
      const symbol = grid[row][col];
      if (checkConsecutive(grid, row, col, 0, 1, symbol)) {
        winningLines.push({
          positions: [[row, col], [row, col + 1], [row, col + 2]],
          symbol,
          count: 3
        });
      }
    }
  }

  // Check vertical lines
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 2; row++) {
      const symbol = grid[row][col];
      if (checkConsecutive(grid, row, col, 1, 0, symbol)) {
        winningLines.push({
          positions: [[row, col], [row + 1, col], [row + 2, col]],
          symbol,
          count: 3
        });
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row < size - 2; row++) {
    for (let col = 0; col < size - 2; col++) {
      const symbol = grid[row][col];
      if (checkConsecutive(grid, row, col, 1, 1, symbol)) {
        winningLines.push({
          positions: [[row, col], [row + 1, col + 1], [row + 2, col + 2]],
          symbol,
          count: 3
        });
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row < size - 2; row++) {
    for (let col = 2; col < size; col++) {
      const symbol = grid[row][col];
      if (checkConsecutive(grid, row, col, 1, -1, symbol)) {
        winningLines.push({
          positions: [[row, col], [row + 1, col - 1], [row + 2, col - 2]],
          symbol,
          count: 3
        });
      }
    }
  }

  return winningLines;
};

const checkConsecutive = (
  grid: string[][],
  startRow: number,
  startCol: number,
  rowDelta: number,
  colDelta: number,
  symbol: string
): boolean => {
  for (let i = 0; i < 3; i++) {
    const row = startRow + (i * rowDelta);
    const col = startCol + (i * colDelta);
    if (grid[row][col] !== symbol) return false;
  }
  return true;
};

export const calculateWinnings = (
  grid: string[][],
  betAmount: number,
  multiplier: number
): { winAmount: number; winningLines: WinningLine[] } => {
  const winningLines = findWinningLines(grid);
  let totalWin = 0;

  winningLines.forEach(line => {
    const symbolValue = SYMBOL_VALUES[line.symbol as keyof typeof SYMBOLS];
    totalWin += betAmount * multiplier * (symbolValue / 100) * line.count;
  });

  return { winAmount: totalWin, winningLines };
};