import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import CharacterSelection from './CharacterSelection';
import type { SquadMember } from '@/data/squads';
import { registerGameShiftUser } from '@/services/gameShiftService';
import WalletConnect from './WalletConnect';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [externalWallet, setExternalWallet] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Starting authentication process:', { email, isLogin });
      
      if (!isLogin) {
        // Register new user with GameShift
        const gameShiftUser = await registerGameShiftUser(
          email,
          isWalletConnected ? externalWallet : undefined
        );
        
        console.log('GameShift user registered:', gameShiftUser);
        
        // Store user data in localStorage
        localStorage.setItem('gameshift_user', JSON.stringify(gameShiftUser));
      }
      
      setIsAuthenticated(true);
      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: "Welcome to Harvest Haven!",
      });
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
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
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
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