import React, { useState } from "react";
import MaggieProfile from "../maggie/MaggieProfile";
import MaggieCarousel from "../maggie/MaggieCarousel";
import MaggieThumbnails from "../maggie/MaggieThumbnails";
import MaggieImageViewer from "../maggie/MaggieImageViewer";
import { Heart } from "lucide-react";

const MeetMaggie = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  return (
    <section id="maggie" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">About the Author</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Meet Maggie
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know the lovable pup behind these heartwarming Bible stories
          </p>
        </div>
        
        <MaggieProfile />

        <div className="mt-16">
          <h3 className="text-xl font-display font-semibold text-center mb-8 text-foreground">
            Behind the Scenes
          </h3>
          
          <MaggieCarousel onImageClick={handleImageClick} />
          
          <MaggieThumbnails onImageClick={handleImageClick} />
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic text-lg">
            "I may be small, but my stories are big!" — Maggie
          </p>
        </div>
      </div>

      <MaggieImageViewer 
        selectedImage={selectedImage} 
        onClose={handleCloseViewer} 
        onSelectImage={setSelectedImage} 
      />
    </section>
  );
};

export default MeetMaggie;
