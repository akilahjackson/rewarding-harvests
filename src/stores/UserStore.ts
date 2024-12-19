import { makeAutoObservable, runInAction } from "mobx";
import {
  createUserInGameShift,
  saveUserToDatabase,
  fetchUserFromDatabase,
  addPlayerAction,
} from "@/services/userService";

export interface UserData {
  id: string;
  email: string;
  username?: string;
  gameshiftId?: string;
  walletAddress?: string;
  token?: string;
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
        username,
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

  async login(email: string): Promise<UserData & { token: string }> {
    console.log("UserStore: Starting login process for email:", email);
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetchUserFromDatabase(email);
      console.log("UserStore: Received login response:", response);

      if (!response?.user?.email) {
        throw new Error("Invalid login response from server");
      }

      const userData = {
        ...response.user,
        token: response.token,
      };

      runInAction(() => {
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem("gameshift_user", JSON.stringify(response.user));
        localStorage.setItem("auth_token", response.token);
      });

      console.log("UserStore: Login successful, returning user data");
      return userData;
    } catch (error) {
      console.error("UserStore: Login failed:", error);
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

  async logPlayerAction(
    actionType: string,
    actionDescription = "N/A"
  ): Promise<void> {
    try {
      if (!this.user) {
        throw new Error("User not logged in.");
      }

      await addPlayerAction(
        this.user.id,
        this.user.email,
        actionType,
        actionDescription,
        "web"
      );

      console.log("✅ Player action logged:", actionType, actionDescription);
    } catch (error) {
      console.error("❌ Error logging player action:", error);
      throw error;
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

export const userStore = new UserStore();