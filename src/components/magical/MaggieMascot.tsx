import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MaggieMascot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPawPrints, setShowPawPrints] = useState(false);

  const messages = [
    "Woof! Let's explore Bible stories! 📖",
    "Hi friend! Ready for an adventure? ✨",
    "God loves you SO much! 💖",
    "Want to hear a story? 🌟",
    "Let's learn together! 🐾",
    "You're pawsitively amazing! 🌈",
  ];

  // Paw print positions - trail from right to left leading to Maggie
  const pawPrints = [
    { x: 180, y: -20, delay: 0, rotate: -15 },
    { x: 140, y: -35, delay: 150, rotate: 10 },
    { x: 100, y: -25, delay: 300, rotate: -20 },
    { x: 60, y: -40, delay: 450, rotate: 5 },
    { x: 25, y: -30, delay: 600, rotate: -10 },
  ];

  useEffect(() => {
    // Show paw prints first, then mascot
    const pawTimer = setTimeout(() => {
      if (!isDismissed) {
        setShowPawPrints(true);
      }
    }, 1000);

    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
        setMessage(messages[0]);
        setShowBubble(true);
      }
    }, 2000);

    // Hide paw prints after Maggie appears
    const hidePawsTimer = setTimeout(() => {
      setShowPawPrints(false);
    }, 4000);

    return () => {
      clearTimeout(pawTimer);
      clearTimeout(timer);
      clearTimeout(hidePawsTimer);
    };
  }, [isDismissed]);

  useEffect(() => {
    if (!isVisible || isDismissed) return;

    // Rotate messages
    const messageInterval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);
      setShowBubble(true);
      
      // Hide bubble after 4 seconds
      setTimeout(() => setShowBubble(false), 4000);
    }, 8000);

    return () => clearInterval(messageInterval);
  }, [isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    setShowPawPrints(false);
  };

  if (isDismissed) return null;

  return (
    <>
      {/* Paw print trail */}
      {showPawPrints && pawPrints.map((paw, index) => (
        <div
          key={index}
          className="fixed bottom-20 left-4 z-30 pointer-events-none"
          style={{
            transform: `translateX(${paw.x}px) translateY(${paw.y}px) rotate(${paw.rotate}deg)`,
            animation: `paw-appear 0.4s ease-out ${paw.delay}ms both, paw-fade 0.5s ease-out ${paw.delay + 2000}ms both`,
          }}
        >
          <span className="text-2xl opacity-60">🐾</span>
        </div>
      ))}

      {/* Maggie Mascot */}
      {isVisible && (
        <div 
          className="fixed bottom-20 left-4 z-40 animate-bounce-in cursor-pointer group"
          onClick={() => {
            const newMessage = messages[Math.floor(Math.random() * messages.length)];
            setMessage(newMessage);
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 4000);
          }}
        >
          {/* Speech bubble */}
          <div 
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-2xl px-4 py-2 shadow-xl border-2 border-primary/20 transition-all duration-300 whitespace-nowrap ${
              showBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <p className="text-sm font-medium text-foreground">{message}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-primary/20 rotate-45" />
          </div>
          
          {/* Maggie image */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-xl bg-white transform transition-transform group-hover:scale-110 animate-wiggle">
              <img 
                src="/lovable-uploads/MaggieNewNBP.png" 
                alt="Maggie the dog mascot"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Animated tail */}
            <div className="absolute -bottom-2 -right-3 text-2xl animate-tail-wag origin-left">
              🐕‍🦺
            </div>
            
            {/* Wagging tail visual (curved line) */}
            <svg 
              className="absolute -bottom-1 -right-4 w-8 h-6 animate-tail-wag origin-left"
              viewBox="0 0 32 24"
            >
              <path 
                d="M4 12 Q16 4, 28 8 Q32 10, 30 14"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            
            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 text-xl animate-sparkle">✨</div>
            <div className="absolute -bottom-1 -left-1 text-lg animate-sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
            
            {/* Dismiss button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-muted rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
              aria-label="Dismiss Maggie"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MaggieMascot;
