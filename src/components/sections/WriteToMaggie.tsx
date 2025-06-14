
import React from "react";
import LetterToMaggie from "@/components/activities/LetterToMaggie";

const WriteToMaggie = () => (
  <section id="write-to-maggie" className="py-16 bg-pink-50">
    <div className="container mx-auto px-6 max-w-2xl">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-purple-700 font-['Comic_Neue']">
        Write to Maggie
      </h2>
      <p className="text-center text-purple-600 max-w-xl mx-auto mb-6 text-lg">
        Send a special letter to Maggie and she might write back!
      </p>
      <LetterToMaggie />
    </div>
  </section>
);

export default WriteToMaggie;
