import { makeAutoObservable } from "mobx";

class GameStore {
  isSpinning = false;
  assetsLoaded = false;
  activeScene = "PreloaderScene";

  constructor() {
    makeAutoObservable(this);
  }

  setAssetsLoaded(loaded: boolean) {
    this.assetsLoaded = loaded;
  }

  setActiveScene(scene: string) {
    this.activeScene = scene;
    console.log("GameStore: Setting active scene to:", scene);
  }

  initializeGameScene(sceneClass: any) {
    // Logic for initializing the game scene goes here
    console.log("GameStore: Initializing game scene:", sceneClass);
    this.setAssetsLoaded(true);
    this.setActiveScene("MainGameScene");
  }
}

export const gameStore = new GameStore();