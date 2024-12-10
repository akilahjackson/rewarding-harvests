import { makeAutoObservable, runInAction } from 'mobx';

export interface GameState {
  balance: number;
  betAmount: number;
  totalWinnings: number;
  isSpinning: boolean;
  isAutoSpin: boolean;
  isMuted: boolean;
}

class GameStore {
  balance: number = 10000;
  betAmount: number = 100;
  totalWinnings: number = 0;
  isSpinning: boolean = false;
  isAutoSpin: boolean = false;
  isMuted: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadGameState();
    console.log('GameStore: Initialized with state:', this.getState());
  }

  private loadGameState() {
    const savedState = localStorage.getItem('gameshift_game_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      runInAction(() => {
        Object.assign(this, parsedState);
      });
      console.log('GameStore: Loaded saved state:', parsedState);
    }
  }

  private saveGameState() {
    const state = this.getState();
    localStorage.setItem('gameshift_game_state', JSON.stringify(state));
    console.log('GameStore: Saved state:', state);
  }

  getState(): GameState {
    return {
      balance: this.balance,
      betAmount: this.betAmount,
      totalWinnings: this.totalWinnings,
      isSpinning: this.isSpinning,
      isAutoSpin: this.isAutoSpin,
      isMuted: this.isMuted
    };
  }

  setBetAmount(amount: number) {
    console.log('GameStore: Setting bet amount:', amount);
    this.betAmount = amount;
    this.saveGameState();
  }

  setBalance(amount: number) {
    console.log('GameStore: Setting balance:', amount);
    this.balance = amount;
    this.saveGameState();
  }

  setTotalWinnings(amount: number) {
    console.log('GameStore: Setting total winnings:', amount);
    this.totalWinnings = amount;
    this.saveGameState();
  }

  setSpinning(spinning: boolean) {
    console.log('GameStore: Setting spinning state:', spinning);
    this.isSpinning = spinning;
    this.saveGameState();
  }

  toggleAutoSpin() {
    console.log('GameStore: Toggling auto spin');
    this.isAutoSpin = !this.isAutoSpin;
    this.saveGameState();
  }

  toggleMute() {
    console.log('GameStore: Toggling mute');
    this.isMuted = !this.isMuted;
    this.saveGameState();
  }

  updateAfterSpin(winAmount: number) {
    runInAction(() => {
      this.balance += winAmount;
      this.totalWinnings += winAmount;
      this.isSpinning = false;
      this.saveGameState();
    });
    console.log('GameStore: Updated after spin, win amount:', winAmount);
  }

  placeBet() {
    if (this.betAmount > this.balance) {
      throw new Error('Insufficient balance');
    }
    runInAction(() => {
      this.balance -= this.betAmount;
      this.isSpinning = true;
      this.saveGameState();
    });
    console.log('GameStore: Placed bet:', this.betAmount);
  }
}

export const gameStore = new GameStore();