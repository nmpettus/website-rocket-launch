import React from "react";
import MaggiesBibleAdventure from "@/components/games/MaggiesBibleAdventure";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  return (
    <section id="games" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Games & Adventures
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join Maggie on interactive adventures that teach valuable Bible lessons through fun gameplay
          </p>
        </div>
        
        <div className="flex justify-center">
          <MaggiesBibleAdventure />
        </div>
      </div>
    </section>
  );
};

export default Games;
