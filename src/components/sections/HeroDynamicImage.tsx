import React, { useState, useEffect } from "react";

const HeroDynamicImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Book illustration images instead of photos
  const heroImages = [
    { src: "/illustrations/God1.png", alt: "God's love illustration from Maggie's books" },
    { src: "/illustrations/maggie1.jpg", alt: "Maggie character illustration" },
    { src: "/illustrations/mSmile1.jpg", alt: "Smiling Maggie book illustration" },
    { src: "/illustrations/msweet.jpg", alt: "Sweet Maggie character art" },
    { src: "/illustrations/mSur4.jpg", alt: "Surprised Maggie illustration" },
    { src: "/illustrations/stars2.jpg", alt: "Starry night book illustration" },
    { src: "/illustrations/Rolling4.jpg", alt: "Rolling hills book scene" },
    { src: "/illustrations/mI.jpg", alt: "Maggie book character design" }
  ];
  
  // Debug logging
  console.log("HeroDynamicImage rendering, heroImages length:", heroImages.length);
  console.log("Current image:", heroImages[currentImageIndex]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % heroImages.length;
        console.log("Switching to image index:", newIndex);
        return newIndex;
      });
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl w-full max-w-md min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Main carousel container */}
      <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentImageIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover rounded-xl"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        
        {/* Decorative floating elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 left-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Soft gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl pointer-events-none"></div>
    </div>
  );
};

export default HeroDynamicImage;