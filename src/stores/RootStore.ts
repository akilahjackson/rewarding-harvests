import { userStore } from './UserStore';

class RootStore {
  userStore = userStore;
  
  constructor() {
    // Initialize other stores here as needed
  }
}

export const rootStore = new RootStore();