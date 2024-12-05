import React from 'react';
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  username: string;
  avatarUrl?: string;
  walletBalance?: string;
  tokenBalance?: string;
}

const UserMenu = ({ username, avatarUrl, walletBalance = "0", tokenBalance = "0" }: UserMenuProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="absolute top-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-nightsky/80 hover:bg-nightsky">
            <Menu className="h-6 w-6 text-neongreen" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-nightsky/95 border-harvestorange">
          <SheetHeader>
            <SheetTitle className="text-neongreen">Account Menu</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-harvestorange text-white">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-neongreen font-bold">{username}</p>
                <p className="text-sm text-harvestpeach">Active</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-nightsky/50 p-3 rounded-lg">
                <p className="text-sm text-harvestpeach">Wallet Balance</p>
                <p className="text-neongreen font-bold">{walletBalance} SOL</p>
              </div>
              <div className="bg-nightsky/50 p-3 rounded-lg">
                <p className="text-sm text-harvestpeach">HRVST Tokens</p>
                <p className="text-neongreen font-bold">{tokenBalance}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { label: "Account Settings", path: "/settings" },
                { label: "Games", path: "/games" },
                { label: "Marketplace", path: "/marketplace" },
                { label: "Buy Tokens", path: "/buy-tokens" },
                { label: "Collectibles", path: "/collectibles" },
                { label: "Activity", path: "/activity" },
              ].map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-neongreen hover:bg-nightsky/50"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            <Button 
              variant="destructive" 
              className="w-full mt-4"
              onClick={() => {
                // Handle logout
                localStorage.removeItem('gameshift_user');
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserMenu;