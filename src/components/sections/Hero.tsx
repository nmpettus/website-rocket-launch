import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Sparkles } from "lucide-react";
import HeroDynamicImage from "./HeroDynamicImage";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative floating elements */}
      <div className="absolute top-32 left-10 w-16 h-16 rounded-full bg-gold-light opacity-60 animate-float" />
      <div className="absolute top-48 right-20 w-12 h-12 rounded-full bg-rose-light opacity-50 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-sage-light opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-48 right-1/3 w-8 h-8 rounded-full bg-lavender opacity-60 animate-float" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="space-y-8 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-sage/20">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-charcoal">Faith-Based Children's Books</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal leading-tight">
              Stories of Faith,
              <br />
              <span className="text-sage">Love & Wonder</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-charcoal/70 leading-relaxed">
              Join Maggie on heartwarming adventures through Bible stories that inspire, 
              teach, and bring joy to children and families everywhere.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-sage hover:bg-sage-dark text-white font-medium py-6 px-8 rounded-full shadow-elegant transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => scrollToSection('books')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Our Books
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-sage text-sage hover:bg-sage hover:text-white font-medium py-6 px-8 rounded-full transition-all duration-300"
                onClick={() => scrollToSection('write-to-maggie')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Write to Maggie
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-light border-2 border-white flex items-center justify-center text-xs">⭐</div>
                  <div className="w-8 h-8 rounded-full bg-gold-light border-2 border-white flex items-center justify-center text-xs">⭐</div>
                  <div className="w-8 h-8 rounded-full bg-sage-light border-2 border-white flex items-center justify-center text-xs">⭐</div>
                </div>
                <span className="text-sm text-charcoal/60">5-Star Reviews</span>
              </div>
              <div className="h-6 w-px bg-charcoal/20" />
              <span className="text-sm text-charcoal/60">Available on Amazon</span>
            </div>
          </div>
          
          {/* Hero Image Carousel */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroDynamicImage />
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(45, 33%, 98%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
