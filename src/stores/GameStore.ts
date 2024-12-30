import { makeAutoObservable } from "mobx";
import {
  addPlayerAction,
  refreshWalletBalances,
} from "@/services/GameShiftService";

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
  symbolKeys: string[] = ["cherry", "lemon", "orange", "plum", "bell", "star"];

  constructor() {
    makeAutoObservable(this);
  }

  // Get current game state
  getState(): GameState {
    return {
      balance: this.balance,
      totalWinnings: this.totalWinnings,
      isSpinning: this.isSpinning,
      isAutoSpin: this.isAutoSpin,
      isMuted: this.isMuted,
      assetsLoaded: this.assetsLoaded,
      activeScene: this.activeScene,
      walletBalances: this.walletBalances,
    };
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
    if (!this.playerId || !this.playerEmail || !this.walletAddress) {
      console.error("❌ Missing player information. Cannot log player action.");
      return;
    }

    try {
      const response = await addPlayerAction(
        this.playerId,
        this.playerEmail,
        this.walletAddress,
        actionType,
        actionDescription
      );
      console.log("✅ Player action logged:", response);
    } catch (error) {
      console.error("❌ Error logging player action:", error);
    }
  }

  // Refresh wallet balances and update the store
  async updateWalletBalances() {
    if (!this.playerId) {
      console.error("❌ Missing player ID. Cannot refresh wallet balances.");
      return;
    }

    try {
      await refreshWalletBalances(this.playerId);
      console.log("✅ Wallet balances updated in the game store.");
    } catch (error) {
      console.error("❌ Error updating wallet balances:", error);
    }
  }

  // Set player information
  setPlayerInfo(playerId: string, playerEmail: string, walletAddress: string) {
    this.playerId = playerId;
    this.playerEmail = playerEmail;
    this.walletAddress = walletAddress;
    console.log("✅ Player info set:", { playerId, playerEmail, walletAddress });
  }

  // Connect to Phaser game instance
  connectToGameInstance(gameInstance: Phaser.Game | null) {
    if (!this.gameInstance && gameInstance) {
      console.log("GameStore: Connected to Phaser game instance.");
      this.gameInstance = gameInstance;
    } else {
      console.warn("GameStore: Game instance already connected or unavailable.");
    }
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
}

export const gameStore = new GameStore();
