import React from "react";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
const Hero = () => {
  // Scroll so #write-to-maggie is at the very top of the viewport — no offset.
  const scrollToLetterSection = () => {
    const letterSection = document.getElementById('write-to-maggie');
    if (letterSection) {
      letterSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to activities section if not found
      document.getElementById('activities')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="home" className="pt-32 pb-16 md:py-24 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white">
      <div className="container mx-auto px-6">
        {/* Mobile bouncing button has been moved into the grid below */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 max-w-lg relative">
            <h1 className="text-4xl md:text-5xl font-bold font-canva leading-tight">
              Christian Children's
              <br />Books by Maggie
              <br />Faith-Based Stories
            </h1>
            <p className="text-xl">Discover faith-based children's books by author Maggie. Heartwarming Bible stories and Christian values for kids—perfect for family reading and gifts.</p>
            
            {/* Send Maggie a Letter button - positioned below subtitle */}
            <div className="flex justify-center md:justify-start">
              <Button className="rounded-full bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-5 shadow-lg group transition-all duration-300 animate-[bounce_2s_infinite]" onClick={scrollToLetterSection}>
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">Send Maggie a Letter!</span>
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full animate-pulse"></div>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full" onClick={() => document.getElementById('books')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Explore Books
              </Button>
              <Button variant="outline" className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-full" onClick={() => document.getElementById('newsletter')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })}>
                Join Our List
              </Button>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full" onClick={() => window.open('https://velvety-lamington-6fd815.netlify.app', '_blank')}>
                Ask Maggie a Bible Question
              </Button>
            </div>
          </div>
          <div className="flex justify-center relative">
            <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie with books" className="rounded-xl shadow-2xl max-w-full md:max-w-md h-auto" loading="eager" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;