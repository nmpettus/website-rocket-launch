
import React from "react";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

const Hero = () => {
  const scrollToLetterSection = () => {
    const letterSection = document.getElementById('write-to-maggie');
    if (letterSection) {
      letterSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to activities section if specific element not found
      document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white">
      <div className="container mx-auto px-6">
        {/* Mobile bouncing button - positioned at top for mobile */}
        <div className="md:hidden flex justify-center mb-6">
          <Button 
            className="rounded-full bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-5 shadow-lg group transition-all duration-300 animate-bounce"
            onClick={scrollToLetterSection}
          >
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="group-hover:underline">Send Maggie a Letter!</span>
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full animate-pulse"></div>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 max-w-lg relative">
            {/* Desktop bouncing button - positioned absolutely for desktop */}
            <div className="hidden md:block absolute -top-8 left-0 animate-bounce">
              <Button 
                className="rounded-full bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-5 shadow-lg group transition-all duration-300"
                onClick={scrollToLetterSection}
              >
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">Send Maggie a Letter!</span>
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full animate-pulse"></div>
              </Button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-canva leading-tight">
              Delightful Bible Stories <br />Narrated By Maggie
            </h1>
            <p className="text-xl">
              Whimsical children's books that spark imagination and joy through the eyes of our beloved Maggie. And others that tell amazing stories of the future and of God's hand in our lives.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-amber-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full"
                onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Books
              </Button>
              <Button 
                variant="outline"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-full"
                onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Join Our List
              </Button>
            </div>
          </div>
          <div className="flex justify-center relative">
            <img 
              src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
              alt="Maggie with books" 
              className="rounded-xl shadow-2xl max-w-full h-auto -mt-16" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
