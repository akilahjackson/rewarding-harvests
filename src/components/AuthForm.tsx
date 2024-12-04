import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement actual authentication logic
      console.log('Auth attempt with:', { email, password, isLogin });
      
      // Simulate successful auth for now
      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: "Welcome to Harvest Haven!",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

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