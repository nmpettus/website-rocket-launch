import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MaggieMascot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const messages = [
    "Woof! Let's explore Bible stories! 📖",
    "Hi friend! Ready for an adventure? ✨",
    "God loves you SO much! 💖",
    "Want to hear a story? 🌟",
    "Let's learn together! 🐾",
    "You're pawsitively amazing! 🌈",
  ];

  useEffect(() => {
    // Show mascot after a short delay
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
        setMessage(messages[0]);
        setShowBubble(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
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
  };

  if (!isVisible || isDismissed) return null;

  return (
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
  );
};

export default MaggieMascot;
