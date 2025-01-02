import Phaser from "phaser";
import { gameStore } from "@/stores/GameStore"; // Import GameStore for state management
import { GRID_SIZE, SYMBOL_SIZE } from "@/scenes/configs/symbolConfig";

export class MainGameScene extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Image[][] = [];
  private balanceText?: Phaser.GameObjects.Text;
  private betAmountText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "MainGameScene" });
  }

  preload() {
    console.log("MainGameScene: Preloading assets...");

    // Preload background
    this.load.image("background", "/images/background.png");

    // Preload symbol assets using gameStore.symbolKeys
    gameStore.symbolKeys.forEach((key) => {
      this.load.image(key, `/images/assets/${key}.png`);
    });
  }

  create() {
    console.log("MainGameScene: Creating scene...");

    const { width, height } = this.cameras.main;

    // Background
    this.add.image(width / 2, height / 2, "background").setDisplaySize(width, height);

    // Add balance text
    this.balanceText = this.add.text(10, 10, `Balance: ${gameStore.balance}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Add bet amount text
    this.betAmountText = this.add.text(10, 50, `Bet Amount: ${gameStore.betAmount}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Create slot grid
    this.createSlotGrid();

    // Add spin button
    const spinButton = this.add.text(width / 2, height - 50, "SPIN", {
      fontSize: "32px",
      color: "#4AE54A",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    });
    spinButton.setOrigin(0.5);
    spinButton.setInteractive();
    spinButton.on("pointerdown", this.handleSpin, this);

    // Update GameStore with the active scene
    gameStore.setActiveScene("MainGameScene");
  }

  private createSlotGrid() {
    console.log("MainGameScene: Creating slot grid...");

    const { width, height } = this.cameras.main;
    const gridStartX = width / 2 - (GRID_SIZE * SYMBOL_SIZE) / 2;
    const gridStartY = height / 2 - (GRID_SIZE * SYMBOL_SIZE) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      this.symbols[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = gridStartX + col * SYMBOL_SIZE;
        const y = gridStartY + row * SYMBOL_SIZE;

        // Default to the first symbol key from gameStore
        const defaultSymbolKey = gameStore.symbolKeys[0] || "default";
        const symbol = this.add
          .image(x, y, defaultSymbolKey)
          .setDisplaySize(SYMBOL_SIZE, SYMBOL_SIZE)
          .setOrigin(0.5);

        this.symbols[row][col] = symbol;
      }
    }
  }

  private handleSpin() {
    console.log("MainGameScene: Handling spin...");

    const { balance, betAmount } = gameStore;

    if (balance < betAmount) {
      console.warn("MainGameScene: Insufficient balance!");
      return;
    }

    // Deduct bet amount
    gameStore.setBalance(balance - betAmount);

    // Simulate slot spin
    this.time.delayedCall(2000, () => {
      const winnings = Math.random() < 0.5 ? betAmount * 2 : 0; // 50% chance to double bet
      gameStore.setBalance(gameStore.balance + winnings);
      gameStore.setTotalWinnings(gameStore.totalWinnings + winnings);

      console.log(`MainGameScene: Spin result - Winnings: ${winnings}`);
      this.updateSlotGrid();
    });
  }

  private updateSlotGrid() {
    console.log("MainGameScene: Updating slot grid...");

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Randomly select a symbol key from gameStore.symbolKeys
        const randomKey =
          gameStore.symbolKeys[Math.floor(Math.random() * gameStore.symbolKeys.length)];
        this.symbols[row][col].setTexture(randomKey);
      }
    }
  }

  update() {
    // Update text objects to reflect current game state
    if (this.balanceText) {
      this.balanceText.setText(`Balance: ${gameStore.balance}`);
    }
    if (this.betAmountText) {
      this.betAmountText.setText(`Bet Amount: ${gameStore.betAmount}`);
    }
  }
}
