
import React from "react";

const MaggieProfile = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
          alt="Maggie the dog" 
          className="rounded-full h-64 w-64 object-cover border-4 border-white shadow-lg" 
        />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">The Voice Behind the Stories</h3>
        <p className="text-gray-600">
          Maggie is a Yorkie Poo with a passion for storytelling. Born in 2009, she quickly developed a love for children's books when her owner would read to her every night.
        </p>
        <p className="text-gray-600">
          Her gentle nature and expressive eyes make her the perfect narrator for these heartwarming tales. When she's not "writing" books, Maggie enjoys long walks in the park, playing fetch, and of course, listening to more stories!
        </p>
        <p className="text-gray-600 mb-6">
          Maggie believes every child should have access to wonderful stories, which is why she's so passionate about our book giveaway program.
        </p>
      </div>
    </div>
  );
};

export default MaggieProfile;
