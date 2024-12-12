import { makeAutoObservable, runInAction } from "mobx";
import {
  createUserInGameShift,
  saveUserToDatabase,
  fetchUserFromDatabase,
  addPlayerAction,
} from "@/services/userService";

// Corrected UserData interface
export interface UserData {
  gameshiftId: string;  // Correct field from the backend schema
  email: string;
  walletType?: string;
  walletAddress?: string;
  avatarUrl?: string;
}

class UserStore {
  user: UserData | null = null;          // Current user state
  isAuthenticated: boolean = false;      // Authentication status
  isLoading: boolean = false;            // Loading state for API calls
  error: string | null = null;           // Error messages for UI feedback

  constructor() {
    makeAutoObservable(this);            // Enable MobX state management
    this.loadUserFromStorage();          // Load user data from localStorage on init
  }

  /**
   * Register a New User
   * Handles full user registration process:
   * 1. Create user in GameShift
   * 2. Save user in backend database
   * 3. Update MobX state and Local Storage
   */
  async register(email: string): Promise<void> {
    console.log("UserStore: Starting registration process...");
    this.isLoading = true;
    this.error = null;

    try {
      const newUserFromGameShift = await createUserInGameShift(email);

      if (!newUserFromGameShift?.referenceId) {
        throw new Error("Failed to create user in GameShift.");
      }
      console.log("✅ User registered in GameShift:", newUserFromGameShift);

      const savedUser = await saveUserToDatabase({
        gameshiftId: newUserFromGameShift.referenceId,   // Correct mapping
        email: newUserFromGameShift.email,
        walletType: newUserFromGameShift.walletType || "unknown",
        walletAddress: newUserFromGameShift.walletAddress || "unknown",
      });

      if (!savedUser?.gameshiftId) {
        throw new Error("Failed to save user in the backend database.");
      }
      console.log("✅ User saved in backend:", savedUser);

      runInAction(() => {
        this.user = savedUser;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(savedUser));
      });

      console.log("✅ Registration Complete:", this.user);
    } catch (error) {
      console.error("❌ Registration Failed:", error.message || error);
      runInAction(() => {
        this.error = (error as Error).message || "Registration Failed";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Log In an Existing User
   * Logs in the user using email only and fetches their full profile.
   */
  async login(email: string): Promise<void> {
    console.log("UserStore: Starting login process...");
    this.isLoading = true;
    this.error = null;

    try {
      const { user, token } = await fetchUserFromDatabase(email);

      if (!user?.email || !token) {
        throw new Error("User account could not be loaded from the database.");
      }
      console.log("✅ User data loaded from backend:", user);

      localStorage.setItem("auth_token", token);  // Save JWT Token

      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(user));
      });

      console.log("✅ Login Successful:", this.user);
    } catch (error) {
      console.error("❌ Login Failed:", error.message || error);
      runInAction(() => {
        this.error = (error as Error).message || "Login Failed";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Load User Data from Local Storage
   * Ensures user persistence across sessions.
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

        console.log("✅ User Loaded from Local Storage:", this.user);
      } else {
        console.warn("⚠️ No user found in local storage.");
      }
    } catch (error) {
      console.error("❌ Failed to load user from local storage:", error);
    }
  }

  /**
   * Log a Player Action
   * Logs the user's action using the correct backend API call.
   */
  async logPlayerAction(
    actionType: string,
    actionDescription = "N/A"
  ): Promise<void> {
    try {
      if (!this.user) {
        throw new Error("User not logged in.");
      }

      await addPlayerAction(
        this.user.gameshiftId,    // Correct mapping
        this.user.email,
        this.user.walletAddress || "unknown",
        actionType,
        actionDescription
      );

      console.log("✅ Player action logged:", actionType, actionDescription);
    } catch (error) {
      console.error("❌ Error logging player action:", error.message || error);
    }
  }

  /**
   * Log Out the Current User
   * Clears all local storage and resets MobX state.
   */
  logout(): void {
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    });

    localStorage.removeItem("auth_token");
    localStorage.removeItem("gameshift_user");
    console.log("✅ User Logged Out");
  }
}

// Export Singleton Instance
export const userStore = new UserStore();
