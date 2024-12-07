import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '@/components/GameCanvas';
import UserMenu from '@/components/UserMenu';
import BettingControls from '@/components/BettingControls';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HowToPlay from '@/components/HowToPlay';

export const MainGamePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(0.1);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('gameshift_user');
    if (!userStr) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Check session timeout
    const checkSession = () => {
      const lastActive = localStorage.getItem('lastActive');
      if (lastActive) {
        const inactiveTime = new Date().getTime() - new Date(lastActive).getTime();
        if (inactiveTime > 15 * 60 * 1000) { // 15 minutes
          localStorage.removeItem('gameshift_user');
          localStorage.removeItem('lastActive');
          navigate('/');
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  const handleSpin = () => {
    if (betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please lower your bet amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - betAmount);

    // Simulate spin result after 2 seconds
    setTimeout(() => {
      const win = Math.random() > 0.5;
      const winAmount = win ? betAmount * 2 : 0;
      
      if (win) {
        setBalance(prev => prev + winAmount);
        setTotalWinnings(prev => prev + winAmount);
        toast({
          title: "Winner!",
          description: `You won ${winAmount.toFixed(2)} SOL!`,
        });
      }

      setIsSpinning(false);
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-nightsky relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/images/neon-crop-circles.WEBP')` }}
      />
      
      <UserMenu 
        username={user.username || 'Player'}
        avatarUrl={user.avatarUrl}
        walletBalance={balance.toFixed(3)}
        tokenBalance={totalWinnings.toFixed(3)}
      />

      <GameCanvas />

      <BettingControls
        balance={balance}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        totalWinnings={totalWinnings}
        isSpinning={isSpinning}
        onSpin={handleSpin}
        isAutoSpin={isAutoSpin}
        onAutoSpinToggle={() => setIsAutoSpin(!isAutoSpin)}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted(!isMuted)}
        helpButton={
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHelp(true)}
            className="bg-nightsky/50 border-neongreen"
          >
            <HelpCircle className="h-6 w-6 text-neongreen" />
          </Button>
        }
      />

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Play</DialogTitle>
          </DialogHeader>
          <HowToPlay />
        </DialogContent>
      </Dialog>
    </div>
  );
};