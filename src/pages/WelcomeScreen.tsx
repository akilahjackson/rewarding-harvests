import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Target, ArrowRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import UserMenuBar from "@/components/UserMenuBar";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    const bgMusic = new Audio("/sounds/background-music.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch((error) => console.log("Audio playback failed:", error));

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{
        backgroundImage: `url('/images/neon-crop-circles.WEBP')`,
        backgroundColor: "#1A1F2C",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <UserMenuBar />

      <div className="relative container mx-auto px-4 pt-20 pb-12">
        <h1 className="text-5xl font-extrabold text-neongreen text-center mb-12 drop-shadow-md animate-fade-in">
          Welcome, {user.username}!
        </h1>

        {/* Start Playing Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => navigate("/game")}
            className="bg-gradient-to-r from-harvestorange to-harvestpeach text-black font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-harvestpeach/50 hover:scale-105 transition-transform flex items-center animate-fade-in"
          >
            Start Playing <ArrowRight className="ml-2" />
          </Button>
        </div>

        {/* Collapsible Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Daily Missions */}
          <Card className="bg-nightsky/80 border border-neongreen/30 rounded-xl transition-all animate-scale-in">
            <div
              className="cursor-pointer flex items-center justify-between p-4 text-neongreen text-2xl"
              onClick={() => setIsDailyMissionsOpen(!isDailyMissionsOpen)}
            >
              <div className="flex items-center">
                <Target className="mr-2" />
                Daily Missions
              </div>
              <span>{isDailyMissionsOpen ? "-" : "+"}</span>
            </div>
            {isDailyMissionsOpen && (
              <div className="p-4">
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
              </div>
            )}
          </Card>

          {/* Leaderboard */}
          <Card className="bg-nightsky/80 border border-neongreen/30 rounded-xl transition-all animate-scale-in">
            <div
              className="cursor-pointer flex items-center justify-between p-4 text-neongreen text-2xl"
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
            >
              <div className="flex items-center">
                <Trophy className="mr-2" />
                Leaderboard
              </div>
              <span>{isLeaderboardOpen ? "-" : "+"}</span>
            </div>
            {isLeaderboardOpen && (
              <div className="p-4">
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
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
