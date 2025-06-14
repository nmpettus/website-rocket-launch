
import React from "react";

// Remove broken imports and temporary children.

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
          {/* Activities removed due to missing files */}
          <div className="col-span-3 text-center text-gray-400 italic py-8">
            More activities coming soon!
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
