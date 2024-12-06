import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, ArrowRight } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import UserMenuBar from '@/components/UserMenuBar';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-nightsky bg-opacity-90 relative">
      <UserMenuBar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-4xl font-bold text-neongreen text-center mb-8">
          Welcome, {user.username}!
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-nightsky/80 border-neongreen/20">
            <CardHeader>
              <CardTitle className="flex items-center text-neongreen">
                <Target className="mr-2" /> Daily Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { task: "Harvest 50 crops", reward: "10 HRVST" },
                  { task: "Complete 3 trades", reward: "15 HRVST" },
                  { task: "Win 5 games", reward: "25 HRVST" }
                ].map((mission, index) => (
                  <li key={index} className="flex justify-between items-center text-white">
                    <span>{mission.task}</span>
                    <span className="text-harvestorange">{mission.reward}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-nightsky/80 border-neongreen/20">
            <CardHeader>
              <CardTitle className="flex items-center text-neongreen">
                <Trophy className="mr-2" /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { name: "Player1", score: "1,250 HRVST" },
                  { name: "Player2", score: "980 HRVST" },
                  { name: "Player3", score: "750 HRVST" }
                ].map((player, index) => (
                  <li key={index} className="flex justify-between items-center text-white">
                    <span>{`${index + 1}. ${player.name}`}</span>
                    <span className="text-harvestorange">{player.score}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate('/game')}
            className="bg-harvestorange hover:bg-harvestpeach text-white font-bold py-3 px-6 rounded-lg flex items-center"
          >
            Start Playing <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;