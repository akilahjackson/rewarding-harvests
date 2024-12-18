import { makeAutoObservable, runInAction } from "mobx";
import {
  createUserInGameShift,
  saveUserToDatabase,
  fetchUserFromDatabase,
  addPlayerAction,
} from "@/services/userService";

// Updated interfaces to match actual API responses
export interface UserData {
  id: string;
  email: string;
  username?: string;
}

interface GameShiftResponse {
  referenceId: string;
  email: string;
}

interface BackendResponse {
  user: UserData;
  token: string;
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

  async register(email: string, username?: string): Promise<void> {
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
        email: newUserFromGameShift.email,
        username
      });

      if (!savedUser?.user?.id) {
        throw new Error("Failed to save user in the backend database.");
      }
      console.log("✅ User saved in backend:", savedUser);

      runInAction(() => {
        this.user = savedUser.user;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(savedUser.user));
      });

      console.log("✅ Registration Complete:", this.user);
    } catch (error) {
      console.error("❌ Registration Failed:", error);
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

      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(user));
      });

      console.log("✅ Login Successful:", this.user);
    } catch (error) {
      console.error("❌ Login Failed:", error);
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
}

export const userStore = new UserStore();