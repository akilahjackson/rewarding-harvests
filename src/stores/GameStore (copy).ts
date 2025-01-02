import { makeAutoObservable } from "mobx";
import Phaser from "phaser";

// Import Phaser scenes
import { PreloaderScene } from "@/scenes/PreloaderScene";
import { SlotGameScene } from "@/scenes/SlotGameScene";


export interface WalletBalances {
  SOL: string;
  USDC: string;
  HRVST: string;
}

export interface GameState {
  balance: number;
  totalWinnings: number;
  isSpinning: boolean;
  isAutoSpin: boolean;
  isMuted: boolean;
  assetsLoaded: boolean;
  activeScene: string;
  walletBalances: WalletBalances;
}

class GameStore {
  // Game state
  balance: number = 10000;
  totalWinnings: number = 0;
  isSpinning: boolean = false;
  isAutoSpin: boolean = false;
  isMuted: boolean = false;
  assetsLoaded: boolean = false;
  activeScene: string = "PreloaderScene";

  // Wallet balances
  walletBalances: WalletBalances = {
    SOL: "0",
    USDC: "0",
    HRVST: "0",
  };

  // Player details
  playerId: string | null = null;
  playerEmail: string | null = null;
  walletAddress: string | null = null;

  // Phaser game instance
  gameInstance: Phaser.Game | null = null;

  // Symbol keys for slot game
  symbolKeys: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Get current game state
  getState(): GameState {
    const state = {
      balance: this.balance,
      totalWinnings: this.totalWinnings,
      isSpinning: this.isSpinning,
      isAutoSpin: this.isAutoSpin,
      isMuted: this.isMuted,
      assetsLoaded: this.assetsLoaded,
      activeScene: this.activeScene,
      walletBalances: this.walletBalances,
    };
    console.log("GameStore: Current state:", state);
    return state;
  }

  // Connect to Phaser game instance
  connectToGameInstance(gameInstance: Phaser.Game) {
    if (this.gameInstance) {
      console.warn("GameStore: Game instance already connected.");
      return;
    }
    console.log("GameStore: Connected to Phaser game instance.");
    this.gameInstance = gameInstance;
  }

  // Destroy the Phaser game instance
  destroyGameInstance() {
    if (this.gameInstance) {
      console.log("GameStore: Destroying Phaser game instance.");
      this.gameInstance.destroy(true);
      this.gameInstance = null;
    } else {
      console.warn("GameStore: No game instance to destroy.");
    }
  }

  // Set active scene
  setActiveScene(scene: string) {
    console.log("GameStore: Setting active scene to:", scene);
    this.activeScene = scene;
  }

  // Set assets loaded status
  setAssetsLoaded(status: boolean) {
    console.log("GameStore: Assets loaded status updated to:", status);
    this.assetsLoaded = status;


  // Change Phaser scene
  changeScene(sceneKey: string) {
    if (!this.gameInstance) {
      console.error("GameStore: No game instance available to change scene.");
      return;
    }
    console.log(`GameStore: Transitioning to scene: ${sceneKey}`);
    this.gameInstance.scene.start(sceneKey);
    this.setActiveScene(sceneKey);
  }

  // Update balance
  setBalance(amount: number) {
    console.log("GameStore: Updating balance to:", amount);
    this.balance = amount;
  }

  // Update total winnings
  setTotalWinnings(amount: number) {
    console.log("GameStore: Updating total winnings by:", amount);
    this.totalWinnings += amount;
  }

  // Update spinning state
  setSpinning(isSpinning: boolean) {
    console.log("GameStore: Updating spinning state to:", isSpinning);
    this.isSpinning = isSpinning;
  }

  // Toggle auto-spin
  toggleAutoSpin() {
    console.log("GameStore: Toggling auto-spin");
    this.isAutoSpin = !this.isAutoSpin;
  }

  // Toggle mute
  toggleMute() {
    console.log("GameStore: Toggling mute");
    this.isMuted = !this.isMuted;
  }

  // Update wallet balances
  setWalletBalances(newBalances: Partial<WalletBalances>) {
    console.log("GameStore: Updating wallet balances:", newBalances);
    this.walletBalances = { ...this.walletBalances, ...newBalances };
  }

  // Log a player action
  async logPlayerAction(actionType: string, actionDescription: string) {
    if (!this.validatePlayerInfo()) return;

    try {
      // Example placeholder for logging player actions
      console.log("Player action logged:", {
        playerId: this.playerId,
        actionType,
        actionDescription,
      });
    } catch (error) {
      console.error("❌ Error logging player action:", error);
    }
  }

  // Set player information
  setPlayerInfo(playerId: string, playerEmail: string, walletAddress: string) {
    this.playerId = playerId;
    this.playerEmail = playerEmail;
    this.walletAddress = walletAddress;
    console.log("✅ Player info set:", { playerId, playerEmail, walletAddress });
  }

  // Validate player information
  validatePlayerInfo(): boolean {
    if (!this.playerId || !this.playerEmail || !this.walletAddress) {
      console.error("❌ Missing player information.");
      return false;
    }
    return true;
  }
}
}

  export const gameStore = new GameStore();
