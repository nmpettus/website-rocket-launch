import React, { useState, useEffect } from "react";

const HeroDynamicImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // All book covers plus original illustrations from Maggie's books
  const heroImages = [
    // Book Covers
    { src: "/lovable-uploads/9915a45c-d79b-4a00-8e51-2d7c4ca0afd8.png", alt: "God's Love as told by Maggie" },
    { src: "/lovable-uploads/711c1342-427a-4191-91d3-7ebe4ec29df9.png", alt: "The Creation Story as told by Maggie" },
    { src: "/lovable-uploads/83369923-a075-46d1-b5cf-54d226cab7da.png", alt: "Noah's Ark as told by Maggie" },
    { src: "/lovable-uploads/b3639f34-6564-48eb-bba5-c7cb2a340f62.png", alt: "Jonah and the Whale as told by Maggie" },
    { src: "/lovable-uploads/thanksgiving-cover.png", alt: "The First Thanksgiving as told by Maggie" },
    { src: "/lovable-uploads/christmas-cover.jpg", alt: "Christmas as told by Maggie" },
    { src: "/lovable-uploads/AI-Adventures-with-Maggie-new-cover.png", alt: "AI Adventures with Maggie" },
    // Original Illustrations from Books
    { src: "/illustrations/God1.png", alt: "Maggie smiling illustration" },
    { src: "/illustrations/mSmile1.jpg", alt: "Maggie head tilt smiling" },
    { src: "/illustrations/Rolling4.jpg", alt: "Maggie rolling in the grass" },
    { src: "/illustrations/stars2.jpg", alt: "Maggie looking at stars" },
    { src: "/lovable-uploads/2e76a583-d39d-45cc-b6cc-0df171740faf.png", alt: "Maggie with camera exploring" },
    { src: "/lovable-uploads/05e4f476-5c93-427b-8793-ace77b054199.png", alt: "Maggie reading a digital book" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        setIsImageLoaded(false);
        return (prevIndex + 1) % heroImages.length;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleManualImageChange = (index: number) => {
    setIsImageLoaded(false);
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl w-full max-w-md min-h-[320px] md:min-h-[420px] bg-white group cursor-pointer transform-gpu transition-all duration-500 hover:scale-[1.02]"
      style={{
        boxShadow: '0 8px 32px -8px rgba(141, 180, 142, 0.3), 0 4px 16px -4px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative border gradient */}
      <div className="absolute inset-0 rounded-3xl p-1 bg-gradient-to-br from-sage via-gold/50 to-rose">
        <div className="w-full h-full rounded-[22px] bg-white" />
      </div>
      
      {/* Main carousel container */}
      <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] z-10">
        {/* Main image */}
        <div className="absolute inset-0 p-3 flex items-center justify-center">
          <img
            key={currentImageIndex}
            src={heroImages[currentImageIndex].src}
            alt={heroImages[currentImageIndex].alt}
            className={`max-w-full max-h-full object-contain rounded-2xl transform-gpu transition-all duration-700 ease-out drop-shadow-lg
              ${isImageLoaded 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95'
              }
            `}
            onLoad={handleImageLoad}
            loading="eager"
          />
        </div>
        
        {/* Navigation arrows - always visible */}
        <button
          onClick={() => handleManualImageChange((currentImageIndex - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-sage hover:bg-sage-dark text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
          aria-label="Previous image"
        >
          <span className="font-bold text-xl">‹</span>
        </button>
        <button
          onClick={() => handleManualImageChange((currentImageIndex + 1) % heroImages.length)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sage hover:bg-sage-dark text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
          aria-label="Next image"
        >
          <span className="font-bold text-xl">›</span>
        </button>
        
        {/* Decorative corner elements */}
        <div className="absolute top-3 right-3 w-4 h-4 bg-gold rounded-full animate-pulse shadow-md z-10"></div>
        <div className="absolute bottom-16 left-3 w-3 h-3 bg-rose rounded-full animate-bounce shadow-sm z-10" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 left-3 w-3 h-3 bg-sage rounded-full animate-pulse shadow-sm z-10" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-sage/20 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentImageIndex 
                ? 'bg-sage scale-110' 
                : 'bg-muted hover:bg-sage/50'
            }`}
            onClick={() => handleManualImageChange(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Image counter badge */}
      <div className="absolute top-3 left-3 bg-charcoal/80 text-white text-xs font-medium px-3 py-1 rounded-full z-20">
        {currentImageIndex + 1} / {heroImages.length}
      </div>
    </div>
  );
};

export default HeroDynamicImage;