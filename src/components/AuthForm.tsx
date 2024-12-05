import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import CharacterSelection from './CharacterSelection';
import type { SquadMember } from '@/data/squads';
import { registerGameShiftUser } from '@/services/gameShiftService';
import WalletConnect from './WalletConnect';
import { LogIn, Mail, User, Twitter, MessageCircle } from "lucide-react";

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [externalWallet, setExternalWallet] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Starting authentication process:', { email, isLogin });
      
      if (!isLogin) {
        const gameShiftUser = await registerGameShiftUser(
          email,
          isWalletConnected ? externalWallet : undefined
        );
        
        console.log('GameShift user registered:', gameShiftUser);
        localStorage.setItem('gameshift_user', JSON.stringify({
          ...gameShiftUser,
          username,
          lastActive: new Date().toISOString()
        }));
      }
      
      setIsAuthenticated(true);
      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: "Welcome to Rewarding Harvest!",
      });

      // Set session timeout
      const timeout = setTimeout(() => {
        localStorage.removeItem('gameshift_user');
        window.location.href = '/';
      }, 15 * 60 * 1000); // 15 minutes

      // Reset timeout on user activity
      const resetTimeout = () => {
        clearTimeout(timeout);
        localStorage.setItem('lastActive', new Date().toISOString());
      };

      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keypress', resetTimeout);

    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider: string) => {
    console.log(`Attempting to login with ${provider}`);
    toast({
      title: "Social Login",
      description: `${provider} login coming soon!`,
    });
  };

  const handleWalletConnect = (address: string) => {
    console.log('External wallet connected:', address);
    setExternalWallet(address);
    setIsWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "External wallet successfully connected!",
    });
  };

  const handleCharacterSelect = (character: SquadMember) => {
    console.log('Selected character:', character);
    onSuccess();
  };

  if (isAuthenticated) {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-nightsky/80 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-neongreen mb-6 text-center">
        {isLogin ? 'Login' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/10 text-white"
              placeholder="Choose a username"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 text-white"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 text-white"
            placeholder="Enter your password"
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label className="text-white">External Wallet (Optional)</Label>
            <WalletConnect
              onConnect={handleWalletConnect}
              isConnected={isWalletConnected}
            />
          </div>
        )}

        <Button 
          type="submit"
          className="w-full bg-harvestorange hover:bg-harvestpeach text-white"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-nightsky px-2 text-white">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Google')}
            className="text-white hover:text-neongreen"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Twitter')}
            className="text-white hover:text-neongreen"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Telegram')}
            className="text-white hover:text-neongreen"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-white">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-neongreen hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
