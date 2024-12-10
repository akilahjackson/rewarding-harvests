import { makeAutoObservable, runInAction } from 'mobx';
import { registerGameShiftUser } from '@/services/gameShiftService';

export interface UserData {
  id: number;
  gameshift_ID: string;
  username: string;
  email: string;
  wallet_type: string;
  wallet_address: string;
  avatar_url: string;
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

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('gameshift_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.setUser(userData);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('gameshift_user');
      }
    }
  }

  setUser(userData: UserData) {
    runInAction(() => {
      this.user = userData;
      this.isAuthenticated = true;
      localStorage.setItem('gameshift_user', JSON.stringify(userData));
    });
  }

  async registerUser(email: string, username: string, walletAddress?: string) {
    this.isLoading = true;
    this.error = null;
    
    try {
      // First, register with GameShift
      const gameShiftResponse = await registerGameShiftUser(email, walletAddress);
      
      // If GameShift registration is successful, create user in database
      const userData: UserData = {
        id: 0, // Will be set by database
        gameshift_ID: gameShiftResponse.id,
        username,
        email,
        wallet_type: walletAddress ? 'solana' : 'none',
        wallet_address: walletAddress || '',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      // Store user data
      this.setUser(userData);
      
      console.log('User registered successfully:', userData);
      return userData;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        console.error('Registration error:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout() {
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('gameshift_user');
    });
  }
}

export const userStore = new UserStore();