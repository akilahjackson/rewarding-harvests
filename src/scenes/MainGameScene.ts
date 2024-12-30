import Phaser from "phaser";
import { gameStore } from "../stores/GameStore";
import { reaction } from "mobx";

export class MainGameScene extends Phaser.Scene {
  private balanceText?: Phaser.GameObjects.Text;
  private betAmountText?: Phaser.GameObjects.Text;
  private disposeReactions: (() => void)[] = []; // Track MobX reactions for cleanup

  constructor() {
    super({ key: "MainGameScene" });
  }

  create() {
    console.log("Creating MainGameScene...");

    const { width, height } = this.cameras.main;

    // Background setup
    this.add.image(width / 2, height / 2, "preloader-bg").setDisplaySize(width, height).setAlpha(0.3);

    // Add balance and bet amount display
    this.balanceText = this.add.text(10, 10, `Balance: ${gameStore.balance}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.betAmountText = this.add.text(10, 50, `Bet Amount: ${gameStore.betAmount}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

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

    // Setup reactions for dynamic updates
    this.setupReactions();

    // Update the active scene in GameStore
    gameStore.setActiveScene("MainGameScene");
  }

  private setupReactions() {
    console.log("MainGameScene: Setting up reactions...");

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

    // Track reactions for cleanup
    this.disposeReactions.push(balanceReaction, betAmountReaction);
  }

  private handleSpin() {
    console.log("MainGameScene: Spin button clicked.");

    const { betAmount, balance } = gameStore;

    // Ensure sufficient balance
    if (balance < betAmount) {
      console.warn("Insufficient balance to spin!");
      return;
    }

    // Deduct bet amount and start spin
    gameStore.setBalance(balance - betAmount);
    gameStore.setSpinning(true);

    // Simulate spin result
    this.time.delayedCall(2000, () => {
      const winnings = Math.floor(Math.random() * betAmount * 5); // Random winnings
      gameStore.setBalance(gameStore.balance + winnings);
      gameStore.setTotalWinnings(gameStore.totalWinnings + winnings);
      gameStore.setSpinning(false);

      console.log(`Spin complete. Winnings: ${winnings}`);
    });
  }

  shutdown() {
    console.log("MainGameScene: Cleaning up...");
    this.disposeReactions.forEach((dispose) => dispose());
    this.disposeReactions = [];
  }
}
