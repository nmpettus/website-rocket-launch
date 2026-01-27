import React, { useState, useEffect } from 'react';

const AnimatedMaggie = () => {
  const [animation, setAnimation] = useState<'idle' | 'wag' | 'jump' | 'wave'>('idle');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cycle through animations
    const animations: ('idle' | 'wag' | 'jump' | 'wave')[] = ['idle', 'wag', 'jump', 'wave'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % animations.length;
      setAnimation(animations[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Magical glow behind Maggie */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-accent/20 to-transparent blur-3xl animate-pulse-slow" />
      
      {/* Floating sparkles around Maggie */}
      <div className="absolute -top-8 left-1/4 text-3xl animate-sparkle">✨</div>
      <div className="absolute -top-4 right-1/4 text-2xl animate-sparkle" style={{ animationDelay: '0.3s' }}>⭐</div>
      <div className="absolute top-1/4 -left-4 text-2xl animate-sparkle" style={{ animationDelay: '0.6s' }}>💫</div>
      <div className="absolute top-1/4 -right-4 text-2xl animate-sparkle" style={{ animationDelay: '0.9s' }}>🌟</div>
      <div className="absolute bottom-1/4 -left-8 text-xl animate-float">💖</div>
      <div className="absolute bottom-1/4 -right-8 text-xl animate-float" style={{ animationDelay: '1s' }}>🐾</div>
      
      {/* Main Maggie image */}
      <div 
        className={`relative transition-transform duration-500 ${
          animation === 'jump' ? 'animate-bounce-big' :
          animation === 'wag' ? 'animate-wiggle' :
          animation === 'wave' ? 'animate-wave' :
          'animate-gentle-bounce'
        }`}
      >
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Circular frame with gradient border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-2 animate-spin-slow">
            <div className="w-full h-full rounded-full bg-background" />
          </div>
          
          {/* Maggie image */}
          <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-background shadow-2xl">
            <img 
              src="/lovable-uploads/MaggieNewNBP.png"
              alt="Maggie the dog - Your faith adventure guide!"
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping-slow" />
        </div>
        
        {/* Status indicator / Action hint */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm animate-bounce whitespace-nowrap">
          {animation === 'jump' ? '🎉 So excited!' :
           animation === 'wag' ? '🐕 *tail wagging*' :
           animation === 'wave' ? '👋 Hi there!' :
           '📖 Let\'s explore!'}
        </div>
      </div>
    </div>
  );
};

export default AnimatedMaggie;
