import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'books', label: 'Books' },
  { id: 'maggie', label: 'Meet Maggie' },
  { id: 'videos', label: 'Videos' },
  { id: 'activities', label: 'Activities' },
  { id: 'games', label: 'Games' },
  { id: 'projects', label: 'Projects' },
  { id: 'newsletter', label: 'Join' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'More' },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80;
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      const navbarHeight = 80;
      let currentSection = '';

      for (const section of sections) {
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < navbarHeight + 40) {
            currentSection = section.id;
          }
        }
      }
      
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        currentSection = 'footer';
      }

      if (activeSection !== currentSection && currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-40 border-b border-slate-200/80 transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
            <span className="text-2xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(link => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={(e) => handleNavClick(e, link.id)} 
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                  activeSection === link.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[320px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-2">
                      <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-10 w-10 rounded-full object-cover" />
                      <span className="text-xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
                    </div>
                  </div>
                  
                  <nav className="flex flex-col space-y-1 p-4">
                    {NAV_LINKS.map(link => (
                      <SheetClose asChild key={link.id}>
                        <a 
                          href={`#${link.id}`} 
                          onClick={(e) => handleNavClick(e, link.id)}
                          className={cn(
                            "block text-lg py-3 px-4 rounded-lg transition-all duration-200",
                            activeSection === link.id
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                          )}
                        >
                          {link.label}
                        </a>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
