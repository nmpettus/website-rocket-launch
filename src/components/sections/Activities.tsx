import React from "react";
import BibleStudy from "@/components/activities/BibleStudy";
import ColoringPage from "@/components/activities/ColoringPage";
import MemoryVerse from "@/components/activities/MemoryVerse";

const Activities = () => {
  return (
    <section id="activities" className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-800 font-['Comic_Neue']">
          Fun Activities
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Engage in fun and educational activities that bring the Bible to life!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BibleStudy />
          <ColoringPage />
          <MemoryVerse />
        </div>
      </div>
    </section>
  );
};

export default Activities;
