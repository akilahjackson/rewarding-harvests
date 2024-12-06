import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { squads, type Squad, type SquadMember } from "@/data/squads";
import { useToast } from "@/components/ui/use-toast";
import UserMenuBar from './UserMenuBar';

interface CharacterSelectionProps {
  onCharacterSelect: (character: SquadMember) => void;
}

const CharacterSelection = ({ onCharacterSelect }: CharacterSelectionProps) => {
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const { toast } = useToast();

  const handleCharacterSelect = (character: SquadMember) => {
    onCharacterSelect(character);
    toast({
      title: "Character Selected",
      description: `You have chosen ${character.name} from the ${selectedSquad?.name}!`,
    });
  };

  return (
    <>
      <UserMenuBar />
      <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-b from-black to-gray-900 rounded-xl shadow-lg mt-16">
        <h2 className="text-4xl font-extrabold text-neongreen mb-8 text-center drop-shadow-md">
          Choose Your Squad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {squads.map((squad) => (
            <Card
              key={squad.id}
              className="bg-nightsky/80 border border-neongreen/20 hover:shadow-lg hover:shadow-neongreen/50 transition-transform transform hover:scale-105 cursor-pointer rounded-xl"
            >
              <CardHeader>
                <CardTitle className="text-neongreen text-2xl drop-shadow-lg">
                  {squad.name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {squad.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={squad.previewImage}
                  alt={squad.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedSquad(squad)}
                      className="w-full bg-gradient-to-r from-harvestorange to-harvestpeach text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-harvestpeach/50 hover:scale-105 transition-all"
                    >
                      View Members
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-nightsky border border-neongreen/20 text-white rounded-lg p-6">
                    <DialogHeader>
                      <DialogTitle className="text-neongreen text-3xl font-bold">
                        {squad.name} Members
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {squad.members.map((member) => (
                        <Card
                          key={member.id}
                          className="bg-nightsky/70 border border-neongreen/30 hover:shadow-lg hover:shadow-neongreen/50 transition-transform transform hover:scale-105 rounded-lg"
                        >
                          <CardHeader>
                            <CardTitle className="text-neongreen text-lg">
                              {member.name}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {member.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <p className="text-gray-400 text-sm mb-4">
                              {member.backstory}
                            </p>
                            <Button
                              onClick={() => handleCharacterSelect(member)}
                              className="w-full bg-gradient-to-r from-harvestorange to-harvestpeach text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-harvestpeach/50 hover:scale-105 transition-all"
                            >
                              Select Character
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default CharacterSelection;
