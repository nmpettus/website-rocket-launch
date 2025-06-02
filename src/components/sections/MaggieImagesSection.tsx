import React from "react";
import { maggie_illustrations } from "@/components/maggie/maggie-images";

const MaggieImagesSection = () => (
  <section id="maggie-images" className="py-16 bg-white">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800 font-['Comic_Neue']">
        Maggie from Her Books
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        Enjoy some of Maggie’s cutest illustrations from her storybooks!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {maggie_illustrations.map((img, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src={img.src}
              alt={img.alt}
              className="rounded-md object-cover w-full h-48 mb-2"
            />
            <span className="text-sm text-gray-500 text-center">{img.alt}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MaggieImagesSection;