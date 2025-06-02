import React, { useState } from "react";
import MaggieProfile from "../maggie/MaggieProfile";
import MaggieCarousel from "../maggie/MaggieCarousel";
import MaggieThumbnails from "../maggie/MaggieThumbnails";
import MaggieImageViewer from "../maggie/MaggieImageViewer";
import MaggieImagesSection from "@/components/sections/MaggieImagesSection";

const MeetMaggie = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  return (
    <section id="maggie" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 font-['Comic_Neue']">Meet Maggie</h2>
        
        <MaggieProfile />

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 font-['Comic_Neue']">Maggie's Photo Gallery</h3>
          
          <MaggieCarousel onImageClick={handleImageClick} />
          
          <MaggieThumbnails onImageClick={handleImageClick} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 italic">
            "I may be small, but my stories are big!" - Maggie
          </p>
        </div>

      

      </div> {/* This closes the container div */}

      <MaggieImageViewer 
        selectedImage={selectedImage} 
        onClose={handleCloseViewer} 
        onSelectImage={setSelectedImage} 
      />
    </section>
  );
};

export default MeetMaggie;
