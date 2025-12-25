import React, { useState, useEffect } from "react";

const HeroDynamicImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // All 5 book covers plus original illustrations from Maggie's books
  const heroImages = [
    // Book Covers
    { src: "/lovable-uploads/9915a45c-d79b-4a00-8e51-2d7c4ca0afd8.png", alt: "God's Love as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/711c1342-427a-4191-91d3-7ebe4ec29df9.png", alt: "The Creation Story as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/83369923-a075-46d1-b5cf-54d226cab7da.png", alt: "Noah's Ark as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/b3639f34-6564-48eb-bba5-c7cb2a340f62.png", alt: "Jonah and the Whale as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/thanksgiving-cover.png", alt: "The First Thanksgiving as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/christmas-cover.jpg", alt: "Christmas as told by Maggie - Book Cover" },
    { src: "/lovable-uploads/AI-Adventures-with-Maggie-new-cover.png", alt: "AI Adventures with Maggie - Book Cover" },
    // Original Illustrations from Books
    { src: "/illustrations/God1.png", alt: "Maggie smiling illustration" },
    { src: "/illustrations/mSmile1.jpg", alt: "Maggie head tilt smiling illustration" },
    { src: "/illustrations/Rolling4.jpg", alt: "Maggie rolling in the grass illustration" },
    { src: "/illustrations/stars2.jpg", alt: "Maggie looking at stars illustration" },
    { src: "/lovable-uploads/2e76a583-d39d-45cc-b6cc-0df171740faf.png", alt: "Maggie with camera exploring outdoors" },
    { src: "/lovable-uploads/05e4f476-5c93-427b-8793-ace77b054199.png", alt: "Maggie reading a digital book" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        setIsImageLoaded(false);
        return (prevIndex + 1) % heroImages.length;
      });
    }, 5000); // Slower transition for better viewing
    
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
      className="relative overflow-hidden rounded-2xl shadow-2xl w-full max-w-md min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-purple-100 to-pink-100 group cursor-pointer transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced main carousel container with perspective */}
      <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 perspective-1000">
        {/* Main image with enhanced animations */}
        <div className="absolute inset-0">
          <img
            key={currentImageIndex}
            src={heroImages[currentImageIndex].src}
            alt={heroImages[currentImageIndex].alt}
            className={`w-full h-full object-contain rounded-2xl transform-gpu transition-all duration-1000 ease-out
              ${isImageLoaded 
                ? 'opacity-100 scale-100 blur-0 rotate-0' 
                : 'opacity-0 scale-90 blur-sm rotate-2'
              }
              ${isHovered 
                ? 'scale-105 brightness-110 saturate-110 shadow-2xl' 
                : 'scale-100 brightness-100 saturate-100'
              }
            `}
            onLoad={handleImageLoad}
            loading="eager"
          />
          
          {/* Dynamic overlay effects */}
          <div className={`absolute inset-0 transition-all duration-700 rounded-2xl
            ${isHovered 
              ? 'bg-gradient-radial from-transparent via-white/5 to-transparent opacity-100' 
              : 'opacity-0'
            }`}
          ></div>
          
          {/* Sparkle animation effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {/* Floating sparkles */}
            <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full transition-all duration-500 ${isHovered ? 'opacity-100 animate-ping' : 'opacity-0'}`}></div>
            <div className={`absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full transition-all duration-700 ${isHovered ? 'opacity-100 animate-ping' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}></div>
            <div className={`absolute top-1/2 right-1/4 w-1 h-1 bg-pink-300 rounded-full transition-all duration-900 ${isHovered ? 'opacity-100 animate-ping' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}></div>
            <div className={`absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1100 ${isHovered ? 'opacity-100 animate-ping' : 'opacity-0'}`} style={{animationDelay: '0.9s'}}></div>
          </div>
        </div>
        
        {/* Navigation arrows with enhanced animations */}
        <button
          onClick={() => handleManualImageChange((currentImageIndex - 1 + heroImages.length) % heroImages.length)}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:-translate-x-1
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
          `}
          aria-label="Previous image"
        >
          <span className="font-bold text-lg">‹</span>
        </button>
        <button
          onClick={() => handleManualImageChange((currentImageIndex + 1) % heroImages.length)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:translate-x-1
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}
          aria-label="Next image"
        >
          <span className="font-bold text-lg">›</span>
        </button>
        
        {/* Enhanced decorative floating elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-6 left-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Enhanced progress indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/30">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-150 transform-gpu ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg scale-125 ring-2 ring-white/50' 
                : 'bg-white/60 hover:bg-white/80 scale-100'
            }`}
            onClick={() => handleManualImageChange(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Dynamic title overlay */}
      <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <p className="text-xs font-medium text-gray-800 text-center max-w-[200px] truncate">
            {heroImages[currentImageIndex].alt}
          </p>
        </div>
      </div>
      
      {/* Soft gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 rounded-2xl pointer-events-none"></div>
      
      {/* Border glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${isHovered ? 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' : ''}`}></div>
    </div>
  );
};

export default HeroDynamicImage;