import { userStore } from './UserStore';
import { gameStore } from './GameStore';

class RootStore {
  userStore = userStore;
  gameStore = gameStore;

  constructor() {
    console.log('RootStore: Initializing...');
    console.log('RootStore: UserStore initialized:', this.userStore);
    console.log('RootStore: GameStore initialized:', this.gameStore);
  }
}

export const rootStore = new RootStore();
