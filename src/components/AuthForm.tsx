import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = observer(({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const { userStore } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  /**
   * Handle Form Submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userStore.isLoading) return;

    try {
      if (!isLogin) {
        // Register a new user
        await userStore.register(email, username);
        toast({
          title: "Account Created",
          description: "Welcome to Rewarding Harvest!",
        });
      } else {
        // Login an existing user
        const userData = await userStore.login(email);
        await userStore.logPlayerAction("login", "User logged in");

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.username || "user"}!`,
        });

        navigate("/welcome");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Toggle Between Login and Registration
   */
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setUsername("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-transparent backdrop-blur-sm rounded-2xl shadow-xl border border-neongreen/30">
      <h2 className="text-3xl font-extrabold text-neongreen text-center mb-6">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <Label htmlFor="username" className="text-neongreen">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required={!isLogin}
              className="bg-gray-800/50 text-white border-none focus:ring-2 focus:ring-neongreen rounded-lg"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-neongreen">
            Email
          </Label>
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

        <Button
          type="submit"
          disabled={userStore.isLoading}
          className={`w-full py-3 font-bold rounded-lg hover:scale-105 transition-transform ${
            userStore.isLoading
              ? "bg-gray-400 text-gray-800"
              : "bg-neongreen text-black hover:bg-green-400"
          }`}
        >
          {userStore.isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </Button>

        <div className="text-center text-sm text-neongreen">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-neongreen hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default AuthForm;