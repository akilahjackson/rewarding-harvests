import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, ShoppingBag, Repeat, Wallet, User, LogOut } from "lucide-react";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('gameshift_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('gameshift_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-nightsky p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-nightsky/80 border border-neongreen/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-neongreen">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-8">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-harvestorange text-white text-xl">
                  {user.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.username || 'Player'}</h2>
                <p className="text-harvestpeach">Member since {new Date(user.created || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-nightsky/50 p-4 rounded-lg border border-neongreen/20">
                <h3 className="text-harvestpeach mb-2">Wallet Balance</h3>
                <p className="text-2xl font-bold text-neongreen">0.00 SOL</p>
              </div>
              <div className="bg-nightsky/50 p-4 rounded-lg border border-neongreen/20">
                <h3 className="text-harvestpeach mb-2">HRVST Tokens</h3>
                <p className="text-2xl font-bold text-neongreen">0</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Settings, label: 'Settings', path: '/settings' },
                { icon: ShoppingBag, label: 'Shop', path: '/shop' },
                { icon: Repeat, label: 'Trade', path: '/trade' },
                { icon: Wallet, label: 'Buy Tokens', path: '/buy-tokens' },
              ].map((item) => (
                <Button
                  key={item.path}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 bg-nightsky/50 border-neongreen/20 hover:bg-neongreen/20"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-6 w-6 mb-2 text-neongreen" />
                  <span className="text-white">{item.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;