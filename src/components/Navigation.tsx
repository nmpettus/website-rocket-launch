
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Handle smooth scrolling to sections with improved offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80; // Approximate height of navbar
      const additionalOffset = 20; // Extra padding to show section headers properly
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - additionalOffset;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home', 'books', 'maggie', 'activities', 
        'projects', 'newsletter', 'contact'
      ];
      
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
              <span className="text-2xl font-bold text-indigo-600 font-['Comic_Neue']">Maggie's Books</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a 
                href="#home" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'home' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>
              <a 
                href="#books" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'books' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'books')}
              >
                Books
              </a>
              <a 
                href="#maggie" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'maggie' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'maggie')}
              >
                Meet Maggie
              </a>
              <a 
                href="#activities" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'activities' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'activities')}
              >
                Activities
              </a>
              <a 
                href="#projects" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'projects' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'projects')}
              >
                Future Projects
              </a>
              <a 
                href="#newsletter" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'newsletter' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'newsletter')}
              >
                Join
              </a>
              <a 
                href="#contact" 
                className={`text-gray-800 hover:text-indigo-600 font-medium ${activeSection === 'contact' ? 'text-indigo-600 font-bold' : ''}`}
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Contact
              </a>
            </div>
            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
