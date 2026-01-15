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
      className="relative overflow-hidden rounded-3xl shadow-elegant w-full max-w-md min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-sage-light via-cream to-rose-light group cursor-pointer transform-gpu transition-all duration-500 hover:shadow-2xl border-4 border-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container */}
      <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
        {/* Main image */}
        <div className="absolute inset-0 p-4">
          <img
            key={currentImageIndex}
            src={heroImages[currentImageIndex].src}
            alt={heroImages[currentImageIndex].alt}
            className={`w-full h-full object-contain rounded-2xl transform-gpu transition-all duration-700 ease-out
              ${isImageLoaded 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95'
              }
              ${isHovered 
                ? 'scale-[1.02]' 
                : 'scale-100'
              }
            `}
            onLoad={handleImageLoad}
            loading="eager"
          />
        </div>
        
        {/* Navigation arrows */}
        <button
          onClick={() => handleManualImageChange((currentImageIndex - 1 + heroImages.length) % heroImages.length)}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center shadow-elegant transition-all duration-300 hover:scale-110 border border-sage/20
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}
          aria-label="Previous image"
        >
          <span className="font-bold text-lg">‹</span>
        </button>
        <button
          onClick={() => handleManualImageChange((currentImageIndex + 1) % heroImages.length)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center shadow-elegant transition-all duration-300 hover:scale-110 border border-sage/20
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
          `}
          aria-label="Next image"
        >
          <span className="font-bold text-lg">›</span>
        </button>
        
        {/* Decorative floating elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-gold rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-16 left-4 w-2 h-2 bg-rose rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-3 w-2 h-2 bg-sage rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-sage/10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 ${
              index === currentImageIndex 
                ? 'bg-sage scale-125 shadow-sm' 
                : 'bg-charcoal/30 hover:bg-charcoal/50'
            }`}
            onClick={() => handleManualImageChange(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Title overlay on hover */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-400 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-elegant border border-sage/10">
          <p className="text-xs font-medium text-charcoal text-center max-w-[200px] truncate">
            {heroImages[currentImageIndex].alt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroDynamicImage;