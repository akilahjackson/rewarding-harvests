import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { registerGameShiftUser } from '@/services/gameShiftService';
import WalletConnect from './WalletConnect';
import { LogIn } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [externalWallet, setExternalWallet] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLogin) {
        const gameShiftUser = await registerGameShiftUser(
          email,
          isWalletConnected ? externalWallet : undefined
        );

        const userData = {
          ...gameShiftUser,
          username,
          email,
          isAuthenticated: true,
          walletBalance: '0.00',
          tokenBalance: '0',
          lastActive: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem('gameshift_user', JSON.stringify(userData));
      }

      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: "Welcome to Rewarding Harvest!",
      });
      
      onSuccess();
      navigate('/welcome');
      
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleWalletConnect = (address: string) => {
    setExternalWallet(address);
    setIsWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "External wallet successfully connected!",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-xl backdrop-blur-md border border-glow">
      <h2 className="text-3xl font-extrabold text-neongreen text-center mb-6">
        {isLogin ? 'Login' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <Label htmlFor="username" className="text-glow">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-glow">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-glow">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
          />
        </div>

        {!isLogin && (
          <div>
            <Label className="text-glow">External Wallet (Optional)</Label>
            <WalletConnect
              onConnect={handleWalletConnect}
              isConnected={isWalletConnected}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-3 bg-neongreen text-black font-bold rounded-lg hover:bg-lightgreen transition-transform transform hover:scale-105"
        >
          <LogIn className="mr-2 w-5 h-5" />
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>

        <div className="text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-neongreen hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;