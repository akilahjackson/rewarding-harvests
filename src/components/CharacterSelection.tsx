import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { squads, type Squad, type SquadMember } from '@/data/squads';
import { useToast } from "@/components/ui/use-toast";

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
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-neongreen mb-8 text-center">
        Choose Your Squad
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {squads.map((squad) => (
          <Card key={squad.id} className="bg-nightsky/80 border-neongreen/20 hover:border-neongreen/50 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-neongreen">{squad.name}</CardTitle>
              <CardDescription className="text-white/70">{squad.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img 
                src={squad.previewImage} 
                alt={squad.name} 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setSelectedSquad(squad)}
                    className="w-full bg-harvestorange hover:bg-harvestpeach"
                  >
                    View Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-nightsky border-neongreen/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-neongreen">{squad.name} Members</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {squad.members.map((member) => (
                      <Card 
                        key={member.id} 
                        className="bg-nightsky/50 border-neongreen/20"
                      >
                        <CardHeader>
                          <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                          <CardDescription className="text-white/70">
                            {member.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <img 
                            src={member.imageUrl} 
                            alt={member.name} 
                            className="w-full h-40 object-cover rounded-md mb-4"
                          />
                          <p className="text-sm text-white/80 mb-4">{member.backstory}</p>
                          <Button
                            onClick={() => handleCharacterSelect(member)}
                            className="w-full bg-harvestorange hover:bg-harvestpeach"
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
  );
};

export default CharacterSelection;