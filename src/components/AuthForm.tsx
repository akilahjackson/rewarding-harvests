import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = observer(({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userStore } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userStore.isLoading) {
      console.warn("⚠️ Submission already in progress...");
      return;
    }

    console.log('AuthForm: Handling form submission');

    try {
      if (!isLogin) {
        console.log('AuthForm: Attempting registration');
        await userStore.register(email, username);

        toast({
          title: "Account Created",
          description: "Welcome to Rewarding Harvest!",
        });
      } else {
        console.log('AuthForm: Attempting login');
        await userStore.login(email);

        toast({
          title: "Login Successful",
          description: "Welcome back to Rewarding Harvest!",
        });
      }

      console.log('AuthForm: Authentication successful, navigating to welcome screen');
      
      if (onSuccess) {
        onSuccess();
      }
      
      navigate('/welcome');

    } catch (error: any) {
      console.error('❌ Auth Error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || String(error) || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-transparent backdrop-blur-sm rounded-2xl shadow-xl border border-neongreen/30">
      <h2 className="text-3xl font-extrabold text-neongreen text-center mb-6">
        {isLogin ? 'Login' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <Label htmlFor="username" className="text-neongreen">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-gray-800/50 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-neongreen">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="bg-gray-800/50 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-neongreen">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="bg-gray-800/50 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
          />
        </div>

        <Button
          type="submit"
          disabled={userStore.isLoading}
          className={`w-full py-3 font-bold rounded-lg hover:scale-105 transition-transform
            ${userStore.isLoading ? 'bg-gray-400 text-gray-800' : 'bg-neongreen text-black hover:bg-green-400'}
          `}
        >
          <LogIn className="mr-2 w-5 h-5" />
          {userStore.isLoading ? "Processing..." : isLogin ? 'Login' : 'Sign Up'}
        </Button>

        <div className="text-center text-sm text-neongreen">
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
});

export default AuthForm;
