import { userStore } from './UserStore';
import { gameStore } from './GameStore';

class RootStore {
  userStore = userStore;
  gameStore = gameStore;
  
  constructor() {
    console.log('RootStore: Initialized with userStore and gameStore');
  }
}

export const rootStore = new RootStore();