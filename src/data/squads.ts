export interface SquadMember {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  backstory: string;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  members: SquadMember[];
}

export const squads: Squad[] = [
  {
    id: "lunar",
    name: "Lunar Squad",
    description: "Masters of celestial energy, the Lunar Squad harnesses the power of moonlight to protect and harvest ethereal crops.",
    previewImage: "/images/squads/lunar-preview.png",
    members: [
      {
        id: "lunar-1",
        name: "Luna",
        description: "Lead Harvester of the Lunar Squad",
        imageUrl: "/images/characters/luna.png",
        backstory: "Born under a harvest moon, Luna leads the Lunar Squad with wisdom and grace."
      },
      // Add more squad members here
    ]
  },
  {
    id: "inferno",
    name: "Inferno Squad",
    description: "Wielding the flames of creation, the Inferno Squad specializes in cultivating heat-resistant crops in volcanic regions.",
    previewImage: "/images/squads/inferno-preview.png",
    members: [
      {
        id: "inferno-1",
        name: "Blaze",
        description: "Captain of the Inferno Squad",
        imageUrl: "/images/characters/blaze.png",
        backstory: "Forged in the eternal flames, Blaze leads his team through the most hostile environments."
      },
      // Add more squad members here
    ]
  },
  {
    id: "nomads",
    name: "The Nomads",
    description: "Wanderers of the vast plains, the Nomads have mastered the art of mobile farming and resource gathering.",
    previewImage: "/images/squads/nomads-preview.png",
    members: [
      {
        id: "nomad-1",
        name: "Wanderer",
        description: "Path Finder of the Nomads",
        imageUrl: "/images/characters/wanderer.png",
        backstory: "A master of finding fertile grounds in the most unexpected places."
      },
      // Add more squad members here
    ]
  },
  {
    id: "mantis",
    name: "Mantis",
    description: "Expert cultivators of rare and exotic species, the Mantis squad specializes in precision harvesting and botanical research.",
    previewImage: "/images/squads/mantis-preview.png",
    members: [
      {
        id: "mantis-1",
        name: "Verde",
        description: "Chief Botanist of the Mantis Squad",
        imageUrl: "/images/characters/verde.png",
        backstory: "A prodigy in xenobotany, Verde leads groundbreaking research in alien plant species."
      },
      // Add more squad members here
    ]
  }
];