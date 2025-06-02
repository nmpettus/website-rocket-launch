
import React from "react";
import { maggie_images } from "./maggie-images";

interface MaggieThumbnailsProps {
  onImageClick: (src: string) => void;
}

const MaggieThumbnails = ({ onImageClick }: MaggieThumbnailsProps) => {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {maggie_images.map((image, index) => (
        <div 
          key={index}
          className="aspect-square cursor-pointer overflow-hidden rounded-md border-2 hover:border-indigo-500 transition-all"
          onClick={() => onImageClick(image.src)}
        >
          <img 
            src={image.src} 
            alt={image.alt} 
            className="h-full w-full object-cover hover:scale-110 transition-transform duration-300" 
          />
        </div>
      ))}
    </div>
  );
};

export default MaggieThumbnails;
