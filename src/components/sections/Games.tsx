
import React from "react";
import MaggiesBibleAdventure from "@/components/games/MaggiesBibleAdventure";
import LetterToMaggie from "@/components/activities/LetterToMaggie";

const Games = () => {
  return (
    <section id="games" className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-800 font-['Comic_Neue']">
          Games & Adventures
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Join Maggie on interactive adventures that teach valuable Bible lessons through fun gameplay!
        </p>
        <div className="flex justify-center mb-16">
          <MaggiesBibleAdventure />
        </div>
        
        {/* Write to Maggie section moved here */}
        <div className="mt-16 max-w-2xl mx-auto">
          <LetterToMaggie />
        </div>
      </div>
    </section>
  );
};

export default Games;
