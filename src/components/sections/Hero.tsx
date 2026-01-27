import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, MessageCircle, Sparkles, Star, Heart } from "lucide-react";
import AnimatedMaggie from "@/components/magical/AnimatedMaggie";
import ConfettiButton from "@/components/magical/ConfettiButton";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Magical gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 rounded-full bg-secondary/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-primary/15 blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
      </div>
      
      {/* Floating magical elements */}
      <div className="absolute top-32 left-[5%] text-4xl animate-float opacity-70">⭐</div>
      <div className="absolute top-48 right-[10%] text-3xl animate-float opacity-60" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-64 left-[15%] text-2xl animate-float opacity-50" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-48 right-[15%] text-3xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-[8%] text-2xl animate-float opacity-50" style={{ animationDelay: '1.5s' }}>💖</div>
      <div className="absolute top-1/3 right-[5%] text-2xl animate-float opacity-40" style={{ animationDelay: '3s' }}>📖</div>
      <div className="absolute bottom-1/3 left-[3%] text-xl animate-float opacity-50" style={{ animationDelay: '2.5s' }}>🐾</div>
      <div className="absolute top-1/2 right-[3%] text-2xl animate-float opacity-40" style={{ animationDelay: '4s' }}>🦋</div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="space-y-8 max-w-xl order-2 lg:order-1">
            {/* Magical badge */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border-2 border-primary/30 animate-bounce-in">
              <Sparkles className="w-5 h-5 text-accent animate-sparkle" />
              <span className="text-sm font-bold text-foreground">✨ Magical Bible Adventures! ✨</span>
              <Star className="w-4 h-4 text-accent animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Main Headline - More playful! */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              <span className="inline-block animate-wave-text">Come</span>{' '}
              <span className="inline-block animate-wave-text" style={{ animationDelay: '0.1s' }}>Explore</span>
              <br />
              <span className="text-primary inline-block animate-wave-text" style={{ animationDelay: '0.2s' }}>Bible</span>{' '}
              <span className="text-accent inline-block animate-wave-text" style={{ animationDelay: '0.3s' }}>Stories</span>
              <br />
              <span className="inline-flex items-center gap-2">
                with <span className="text-secondary">Maggie!</span>
                <Heart className="w-8 h-8 text-secondary animate-heartbeat inline-block" />
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Join Maggie the lovable pup on <span className="text-primary font-semibold">magical adventures</span> through 
              God's amazing stories! Perfect for curious kids and families who love to 
              <span className="text-accent font-semibold"> learn and have fun together!</span> 🐾
            </p>
            
            {/* CTA Buttons with 3D Effect */}
            <div className="flex flex-wrap gap-4">
              <ConfettiButton 
                confettiType="cannon"
                className="btn-3d bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-8 rounded-2xl text-lg border-0"
                onClick={() => scrollToSection('books')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Books! 📚
              </ConfettiButton>
              <ConfettiButton 
                confettiType="stars"
                className="btn-3d-secondary bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-6 px-8 rounded-2xl text-lg border-0"
                onClick={() => scrollToSection('write-to-maggie')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Write to Maggie! ✉️
              </ConfettiButton>
            </div>
            
            {/* Ask Maggie CTA */}
            <ConfettiButton 
              asChild
              confettiType="burst"
              className="btn-3d-accent bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 px-8 rounded-2xl text-lg w-full sm:w-auto border-0"
            >
              <Link to="/ask-maggie">
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask Maggie a Bible Question! 🤔
              </Link>
            </ConfettiButton>
            
            {/* Fun trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="flex -space-x-1">
                  <span className="text-xl">⭐</span>
                  <span className="text-xl">⭐</span>
                  <span className="text-xl">⭐</span>
                  <span className="text-xl">⭐</span>
                  <span className="text-xl">⭐</span>
                </div>
                <span className="text-sm font-medium text-foreground">5-Star Reviews!</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xl">🛒</span>
                <span className="text-sm font-medium text-foreground">On Amazon</span>
              </div>
            </div>
          </div>
          
          {/* Animated Maggie */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <AnimatedMaggie />
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
