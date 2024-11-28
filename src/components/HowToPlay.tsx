import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionMarkCircle } from "lucide-react";

const HowToPlay = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-nightsky/50 border-neongreen">
          <QuestionMarkCircle className="h-5 w-5 text-neongreen" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-nightsky border-neongreen">
        <DialogHeader>
          <DialogTitle className="text-neongreen font-space">How to Play Harvest Slots</DialogTitle>
          <DialogDescription className="text-harvestpeach space-y-4">
            <div className="mt-4">
              <h3 className="font-bold mb-2">Game Rules:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Place your bet using the controls below the game grid</li>
                <li>Click SPIN or use Auto-Spin for continuous play</li>
                <li>Win by matching 3 or more symbols in any direction</li>
                <li>Payouts: 0.001 SOL = 1000 HRVST tokens</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Winning Patterns:</h3>
              <p>Matches can occur in any direction:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Horizontal lines</li>
                <li>Vertical lines</li>
                <li>Diagonal lines</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlay;