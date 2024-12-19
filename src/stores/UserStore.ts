// src/store/UserStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import {
  createUserInGameShift,
  saveUserToDatabase,
  fetchUserFromDatabase,
  addPlayerAction,
  UserResponse,
} from "@/services/UserService";

export interface UserData {
  id: string;
  email: string;
  username?: string;
  gameshiftId?: string;
  walletAddress?: string;
  avatarUrl?: string;
  token?: string;
}

class UserStore {
  user: UserData | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage(); 
  }

  /**
   * Register a new user
   */
  async register(email: string, username: string): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;

    try {
      const newUserFromGameShift = await createUserInGameShift(email);

      if (!newUserFromGameShift?.referenceId) {
        throw new Error("Failed to create user in GameShift.");
      }

      const savedUser = await saveUserToDatabase({
        email: newUserFromGameShift.email,
        username,
      });

      if (!savedUser?.user?.id) {
        throw new Error("Failed to save user in the backend.");
      }

      // Update MobX state
      runInAction(() => {
        this.user = savedUser.user;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(savedUser.user));
      });

      console.log("✅ Registration Complete:", this.user);
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Registration Failed";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Login the user
   */
  async login(email: string): Promise<UserData> {
    if (this.isLoading) return Promise.reject(new Error("Login already in progress."));

    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetchUserFromDatabase(email);

      if (!response || !response.user || !response.token) {
        throw new Error("Invalid login response.");
      }

      const userData: UserData = {
        ...response.user,
        token: response.token,
      };

      // Update MobX state
      runInAction(() => {
        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(userData));
      });

      console.log("✅ Login Successful:", this.user);
      return userData;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Login Failed";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Log player actions after user activity
   */
  async logPlayerAction(actionType: string, actionDescription = "User activity"): Promise<void> {
    if (!this.user) {
      console.warn("⚠️ No user found. Cannot log player action.");
      return;
    }

    try {
      await addPlayerAction(
        this.user.gameshiftId || "unknown",
        this.user.email,
        this.user.walletAddress || "unknown",
        actionType,
        actionDescription
      );

      console.log("✅ Player Action Logged:", actionType, actionDescription);
    } catch (error) {
      console.error("❌ Error Logging Player Action:", error);
    }
  }

  /**
   * Load the user from local storage on app start
   */
  loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem("gameshift_user");
      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        runInAction(() => {
          this.user = parsedUser;
          this.isAuthenticated = true;
        });
        console.log("✅ User Loaded from LocalStorage:", this.user);
      }
    } catch (error) {
      console.error("❌ Failed to Load User from LocalStorage:", error);
    }
  }

  /**
   * Logout the user and clear state
   */
  logout(): void {
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    });

    localStorage.removeItem("gameshift_user");
    console.log("✅ User Logged Out");
  }
}

export const userStore = new UserStore();
