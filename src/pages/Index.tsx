import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  // If user is already authenticated, redirect to game
  React.useEffect(() => {
    if (user?.isAuthenticated) {
      navigate('/game');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome!",
      description: "Successfully authenticated. Redirecting to game...",
    });
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-nightsky flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url('/images/neon-crop-circles.WEBP')` }}
      />
      
      <div className="relative z-10">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default Index;