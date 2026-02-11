import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Rocket, Sparkles } from "lucide-react";

const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);

  const launchDate = new Date("2026-02-21T00:00:00");

  useEffect(() => {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;
    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    setDaysLeft(days);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-accent to-secondary text-white py-2 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
        <Sparkles className="w-4 h-4 animate-sparkle hidden sm:block" />
        <Rocket className="w-4 h-4 animate-bounce" />
        <span className="font-medium">
          <span className="hidden sm:inline">🎉 </span>
          <strong>Maggie's AI Adventures</strong> launches in{" "}
          <span className="font-bold text-white">{daysLeft} days!</span>
        </span>
        <Link 
          to="/maggies-ai-adventures" 
          className="ml-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold transition-colors text-xs sm:text-sm"
        >
          Learn More →
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LaunchBanner;
