
import React from "react";
import MaggiesBibleAdventure from "@/components/games/MaggiesBibleAdventure";

const Games = () => {
  return (
    <section id="games" className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-800 font-['Comic_Neue']">
          Games & Adventures
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-2">
          Join Maggie on interactive adventures that teach valuable Bible lessons through fun gameplay!
        </p>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Find all the Fruits of the Spirit (Jesus Ways)
        </p>
        <div className="flex justify-center">
          <MaggiesBibleAdventure />
        </div>
      </div>
    </section>
  );
};

export default Games;
