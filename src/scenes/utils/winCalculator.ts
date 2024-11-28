import { SYMBOLS, SYMBOL_VALUES, GRID_SIZE } from '../configs/symbolConfig';

interface WinningLine {
  positions: number[][];
  symbol: string;
  count: number;
  winAmount: number;
}

export const findWinningLines = (grid: string[][]): WinningLine[] => {
  const winningLines: WinningLine[] = [];
  
  // Check horizontal lines
  for (let row = 0; row < GRID_SIZE; row++) {
    let currentSymbol = '';
    let count = 0;
    let positions: number[][] = [];
    
    for (let col = 0; col < GRID_SIZE; col++) {
      const symbol = grid[row][col];
      
      if (symbol === currentSymbol) {
        count++;
        positions.push([row, col]);
      } else {
        if (count >= 3) {
          winningLines.push({ 
            positions: [...positions], 
            symbol: currentSymbol, 
            count,
            winAmount: 0 // Will be calculated later
          });
        }
        currentSymbol = symbol;
        count = 1;
        positions = [[row, col]];
      }
    }
    
    if (count >= 3) {
      winningLines.push({ 
        positions: [...positions], 
        symbol: currentSymbol, 
        count,
        winAmount: 0 // Will be calculated later
      });
    }
  }

  // Check vertical lines
  for (let col = 0; col < GRID_SIZE; col++) {
    let currentSymbol = '';
    let count = 0;
    let positions: number[][] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const symbol = grid[row][col];
      
      if (symbol === currentSymbol) {
        count++;
        positions.push([row, col]);
      } else {
        if (count >= 3) {
          winningLines.push({ 
            positions: [...positions], 
            symbol: currentSymbol, 
            count,
            winAmount: 0
          });
        }
        currentSymbol = symbol;
        count = 1;
        positions = [[row, col]];
      }
    }
    
    if (count >= 3) {
      winningLines.push({ 
        positions: [...positions], 
        symbol: currentSymbol, 
        count,
        winAmount: 0
      });
    }
  }

  // Check diagonals
  // Check diagonal (top-left to bottom-right)
  for (let startRow = 0; startRow < GRID_SIZE - 2; startRow++) {
    for (let startCol = 0; startCol < GRID_SIZE - 2; startCol++) {
      const positions: number[][] = [];
      const symbol = grid[startRow][startCol];
      let isWinningLine = true;
      
      for (let i = 0; i < 3; i++) {
        const row = startRow + i;
        const col = startCol + i;
        if (grid[row][col] !== symbol) {
          isWinningLine = false;
          break;
        }
        positions.push([row, col]);
      }
      
      if (isWinningLine) {
        winningLines.push({ positions, symbol, count: 3 });
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let startRow = 0; startRow < GRID_SIZE - 2; startRow++) {
    for (let startCol = GRID_SIZE - 1; startCol >= 2; startCol--) {
      const positions: number[][] = [];
      const symbol = grid[startRow][startCol];
      let isWinningLine = true;
      
      for (let i = 0; i < 3; i++) {
        const row = startRow + i;
        const col = startCol - i;
        if (grid[row][col] !== symbol) {
          isWinningLine = false;
          break;
        }
        positions.push([row, col]);
      }
      
      if (isWinningLine) {
        winningLines.push({ positions, symbol, count: 3 });
      }
    }
  }

  console.log('Found winning lines:', winningLines);
  return winningLines;
};

export const calculateWinnings = (
  grid: string[][],
  betAmount: number,
  multiplier: number
): { totalWinAmount: number; winningLines: WinningLine[] } => {
  const winningLines = findWinningLines(grid);
  let totalWinAmount = 0;

  winningLines.forEach(line => {
    const symbolValue = SYMBOL_VALUES[line.symbol as keyof typeof SYMBOLS];
    line.winAmount = betAmount * multiplier * (symbolValue / 100) * line.count;
    totalWinAmount += line.winAmount;
    console.log(`Win line: ${line.symbol} x${line.count} = ${line.winAmount}`);
  });

  return { totalWinAmount, winningLines };
};
