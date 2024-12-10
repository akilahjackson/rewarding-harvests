import { makeAutoObservable, runInAction } from 'mobx';

interface GameState {
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
    console.log('GameStore: Initialized');
  }

  setBetAmount(amount: number) {
    console.log('GameStore: Setting bet amount:', amount);
    this.betAmount = amount;
  }

  setBalance(amount: number) {
    console.log('GameStore: Setting balance:', amount);
    this.balance = amount;
  }

  setTotalWinnings(amount: number) {
    console.log('GameStore: Setting total winnings:', amount);
    this.totalWinnings = amount;
  }

  setSpinning(spinning: boolean) {
    console.log('GameStore: Setting spinning state:', spinning);
    this.isSpinning = spinning;
  }

  toggleAutoSpin() {
    console.log('GameStore: Toggling auto spin');
    this.isAutoSpin = !this.isAutoSpin;
  }

  toggleMute() {
    console.log('GameStore: Toggling mute');
    this.isMuted = !this.isMuted;
  }

  updateAfterSpin(winAmount: number) {
    runInAction(() => {
      this.balance += winAmount;
      this.totalWinnings += winAmount;
      this.isSpinning = false;
    });
  }

  placeBet() {
    if (this.betAmount > this.balance) {
      throw new Error('Insufficient balance');
    }
    runInAction(() => {
      this.balance -= this.betAmount;
      this.isSpinning = true;
    });
  }
}

export const gameStore = new GameStore();