
import React from "react";
import LetterToMaggie from "@/components/activities/LetterToMaggie";

const WriteToMaggie = () => (
  <section id="write-to-maggie" className="py-8 bg-pink-50"> {/* Was py-16, reduced */}
    <div className="container mx-auto px-4 max-w-2xl"> {/* px reduced for tighter layout */}
      <h2 className="text-3xl font-extrabold text-center mb-1 text-purple-700 font-['Comic_Neue']">
        Write to Maggie
      </h2>
      <p className="text-center text-purple-600 max-w-xl mx-auto mb-3 text-base"> {/* mb and text size reduced */}
        Send a special letter to Maggie and she might write back!
      </p>
      <LetterToMaggie />
    </div>
  </section>
);

export default WriteToMaggie;
