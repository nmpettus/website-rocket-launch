
import React from "react";
import LetterToMaggie from "@/components/activities/LetterToMaggie";

// - Remove section padding, set py-4 (was py-8)
// - Container px-2 (was px-4), max-w-md (was 2xl) for tightness
// - Heading now matches other section titles: text-4xl (was text-6xl)

const WriteToMaggie = () => (
  <section id="write-to-maggie" className="py-16 bg-pink-50 scroll-mt-20">
    <div className="container mx-auto px-2 max-w-md">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-purple-700 font-['Comic_Neue']">
        Write to Maggie
      </h2>
      <p className="text-center text-purple-600 max-w-md mx-auto mb-1 text-sm">
        Send a special letter to Maggie and she might write back!
      </p>
      <LetterToMaggie />
    </div>
  </section>
);

export default WriteToMaggie;
