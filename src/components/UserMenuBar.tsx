import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User, Settings, ShoppingBag, Repeat, Wallet, LogOut, X } from "lucide-react";
import { useUser } from '@/contexts/UserContext';

const UserMenuBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-nightsky/90 border-b border-neongreen/20 px-4 py-2 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-harvestorange text-white">
              {user?.username?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">{user?.username || 'Player'}</p>
            <p className="text-sm text-harvestpeach">{user?.walletBalance || '0.00'} SOL</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/game')}
            className="text-neongreen hover:bg-neongreen/20"
          >
            <X className="h-6 w-6" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neongreen hover:bg-neongreen/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-nightsky border-harvestorange">
              <SheetHeader>
                <SheetTitle className="text-neongreen">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {[
                  { icon: User, label: 'Profile', path: '/profile' },
                  { icon: Settings, label: 'Settings', path: '/settings' },
                  { icon: ShoppingBag, label: 'Shop', path: '/shop' },
                  { icon: Repeat, label: 'Trade', path: '/trade' },
                  { icon: Wallet, label: 'Buy Tokens', path: '/buy-tokens' },
                ].map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-neongreen hover:bg-neongreen/20"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-harvestorange hover:text-harvestpeach hover:bg-harvestorange/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default UserMenuBar;