import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url('/images/neon-crop-circles.WEBP')` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <UserMenuBar />
      
      <div className="relative container mx-auto px-4 pt-20 pb-12">
        <h1 className="text-5xl font-extrabold text-neongreen text-center mb-12 drop-shadow-md">
          Welcome, {user.username}!
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Daily Missions */}
          <Card className="bg-nightsky/80 border border-neongreen/30 hover:shadow-lg hover:shadow-neongreen/50 rounded-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-neongreen text-2xl">
                <Target className="mr-2" /> Daily Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { task: "Harvest 50 crops", reward: "1000 HRVST" },
                  { task: "Complete 3 trades", reward: "1500 HRVST" },
                  { task: "Win 5 games", reward: "2500 HRVST" },
                ].map((mission, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span>{mission.task}</span>
                    <span className="text-harvestorange font-semibold">
                      {mission.reward}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-nightsky/80 border border-neongreen/30 hover:shadow-lg hover:shadow-neongreen/50 rounded-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-neongreen text-2xl">
                <Trophy className="mr-2" /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { name: "Player1", score: "1,250 HRVST" },
                  { name: "Player2", score: "980 HRVST" },
                  { name: "Player3", score: "750 HRVST" },
                ].map((player, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span>{`${index + 1}. ${player.name}`}</span>
                    <span className="text-harvestorange font-semibold">
                      {player.score}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Start Playing Button */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-harvestorange to-harvestpeach text-black font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-harvestpeach/50 hover:scale-105 transition-transform flex items-center"
          >
            Start Playing <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
