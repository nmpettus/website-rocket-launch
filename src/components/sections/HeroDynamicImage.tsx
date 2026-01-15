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
    <div className="relative">
      {/* Soft shadow underneath */}
      <div className="absolute top-4 left-4 right-0 bottom-0 bg-charcoal/10 rounded-3xl blur-xl" />
      
      {/* Main card */}
      <div 
        className="relative overflow-hidden rounded-3xl w-full max-w-md bg-cream border-2 border-sage/20 group cursor-pointer transform-gpu transition-all duration-500 hover:-translate-y-1"
        style={{
          boxShadow: '4px 4px 20px rgba(141, 180, 142, 0.15), -2px -2px 16px rgba(255, 255, 255, 0.8)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative top accent bar */}
        <div className="h-2 bg-gradient-to-r from-sage via-gold to-rose" />
        
        {/* Main carousel container */}
        <div className="relative min-h-[320px] md:min-h-[400px] p-4 bg-white/50">
          {/* Main image */}
          <div className="flex items-center justify-center h-full min-h-[290px] md:min-h-[370px]">
            <img
              key={currentImageIndex}
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              className={`max-w-full max-h-[280px] md:max-h-[360px] object-contain rounded-xl transform-gpu transition-all duration-700 ease-out
                ${isImageLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
                }
              `}
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
              }}
              onLoad={handleImageLoad}
              loading="eager"
            />
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={() => handleManualImageChange((currentImageIndex - 1 + heroImages.length) % heroImages.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-sage hover:text-white text-charcoal w-9 h-9 rounded-full flex items-center justify-center shadow-book transition-all duration-300 hover:scale-110 border border-sage/30"
            aria-label="Previous image"
          >
            <span className="font-semibold text-lg">‹</span>
          </button>
          <button
            onClick={() => handleManualImageChange((currentImageIndex + 1) % heroImages.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-sage hover:text-white text-charcoal w-9 h-9 rounded-full flex items-center justify-center shadow-book transition-all duration-300 hover:scale-110 border border-sage/30"
            aria-label="Next image"
          >
            <span className="font-semibold text-lg">›</span>
          </button>
        </div>
        
        {/* Bottom info bar */}
        <div className="px-4 py-3 bg-sage-light/50 border-t border-sage/10 flex items-center justify-between">
          <p className="text-sm font-medium text-charcoal truncate max-w-[200px]">
            {heroImages[currentImageIndex].alt}
          </p>
          <span className="text-xs text-charcoal/60 font-medium bg-white/60 px-2 py-1 rounded-full">
            {currentImageIndex + 1} of {heroImages.length}
          </span>
        </div>
        
        {/* Progress dots */}
        <div className="px-4 pb-4 pt-2 bg-sage-light/50 flex justify-center gap-1.5">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-sage w-6' 
                  : 'bg-sage/30 hover:bg-sage/50'
              }`}
              onClick={() => handleManualImageChange(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full animate-gentle-bounce shadow-lg flex items-center justify-center">
        <span className="text-white text-xs">✦</span>
      </div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-rose rounded-full animate-float shadow-md" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

export default HeroDynamicImage;