import Phaser from "phaser";
import { gameStore } from "../stores/GameStore";
import { reaction } from "mobx";
import { GRID_SIZE, SYMBOL_SIZE } from "./configs/symbolConfig";

export class SlotGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Image[][] = [];
  private balanceText?: Phaser.GameObjects.Text;
  private betAmountText?: Phaser.GameObjects.Text;
  private disposeReactions: (() => void)[] = []; // Track MobX reactions for cleanup

  constructor() {
    super({ key: "SlotGameScene" });
  }

  create() {
    console.log("Creating SlotGameScene...");

    const { width, height } = this.cameras.main;

    // Background setup
    this.add
      .image(width / 2, height / 2, "preloader-bg")
      .setDisplaySize(width, height)
      .setAlpha(0.3);

    // Display balance and bet amount
    this.balanceText = this.add.text(10, 10, `Balance: ${gameStore.balance}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.betAmountText = this.add.text(10, 50, `Bet Amount: ${gameStore.betAmount}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Add slot grid
    this.createSlotGrid();

    // Add "Spin" button
    const spinButton = this.add.text(width / 2, height - 50, "SPIN", {
      fontSize: "32px",
      color: "#4AE54A",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    });
    spinButton.setInteractive();
    spinButton.setOrigin(0.5);
    spinButton.on("pointerdown", this.handleSpin, this);

    // Setup MobX reactions
    this.setupReactions();

    // Update the active scene in GameStore
    gameStore.setActiveScene("SlotGameScene");
  }

  private setupReactions() {
    console.log("SlotGameScene: Setting up reactions...");

    // React to balance changes
    const balanceReaction = reaction(
      () => gameStore.balance,
      (newBalance) => {
        if (this.balanceText) {
          this.balanceText.setText(`Balance: ${newBalance}`);
        }
      }
    );

    // React to bet amount changes
    const betAmountReaction = reaction(
      () => gameStore.betAmount,
      (newBetAmount) => {
        if (this.betAmountText) {
          this.betAmountText.setText(`Bet Amount: ${newBetAmount}`);
        }
      }
    );

    // React to symbol updates
    const symbolsReaction = reaction(
      () => gameStore.symbolKeys,
      (newSymbols) => {
        console.log("SlotGameScene: Symbols updated in GameStore.", newSymbols);
        this.updateSlotGrid(newSymbols);
      }
    );

    // Track reactions for cleanup
    this.disposeReactions.push(balanceReaction, betAmountReaction, symbolsReaction);
  }

  private createSlotGrid() {
    console.log("SlotGameScene: Creating slot grid...");
    const { width, height } = this.cameras.main;
    const gridStartX = width / 2 - (GRID_SIZE * SYMBOL_SIZE) / 2;
    const gridStartY = height / 2 - (GRID_SIZE * SYMBOL_SIZE) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = gridStartX + col * SYMBOL_SIZE;
        const y = gridStartY + row * SYMBOL_SIZE;

        const symbolKey = gameStore.symbolKeys[row * GRID_SIZE + col] || "placeholder";
        const symbol = this.add
          .image(x, y, symbolKey)
          .setDisplaySize(SYMBOL_SIZE, SYMBOL_SIZE)
          .setOrigin(0.5);

        this.symbols[row][col] = symbol;
      }
    }

    console.log("SlotGameScene: Slot grid created.");
  }

  private handleSpin() {
    console.log("SlotGameScene: Spin button clicked.");

    const { betAmount, balance } = gameStore;

    // Ensure sufficient balance
    if (balance < betAmount) {
      console.warn("Insufficient balance to spin!");
      return;
    }

    // Deduct bet amount and start spin
    gameStore.setBalance(balance - betAmount);
    gameStore.setSpinning(true);

    // Simulate slot results
    this.time.delayedCall(2000, () => {
      const winnings = Math.floor(Math.random() * betAmount * 5); // Random winnings
      gameStore.setBalance(gameStore.balance + winnings);
      gameStore.setTotalWinnings(gameStore.totalWinnings + winnings);
      gameStore.setSpinning(false);

      console.log(`Spin complete. Winnings: ${winnings}`);
      this.updateSlotGrid();
    });
  }

  private updateSlotGrid(newSymbols?: string[]) {
    console.log("SlotGameScene: Updating slot grid...");
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const symbolKey = newSymbols
          ? newSymbols[row * GRID_SIZE + col]
          : `symbol-${Math.floor(Math.random() * 5) + 1}`;
        this.symbols[row][col].setTexture(symbolKey);
      }
    }
  }

  shutdown() {
    console.log("SlotGameScene: Cleaning up...");
    this.disposeReactions.forEach((dispose) => dispose());
    this.disposeReactions = [];
  }
}
