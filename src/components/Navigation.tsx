import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80; // Approximate height of navbar
      // For the footer, we want to scroll to the very bottom, or slightly above it.
      // An offset might not be needed if the footer is tall enough, or if we want the very top of the footer to align.
      // Let's keep the standard offset logic for now, which aligns the top of the section below the navbar.
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
              <span className="text-2xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Home</a>
              <a href="#books" onClick={(e) => handleNavClick(e, 'books')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Books</a>
              <a href="#maggie" onClick={(e) => handleNavClick(e, 'maggie')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Meet Maggie</a>
              <a href="#activities" onClick={(e) => handleNavClick(e, 'activities')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Activities</a>
              <a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Games</a>
              <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Future Projects</a>
              <a href="#newsletter" onClick={(e) => handleNavClick(e, 'newsletter')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Join</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Contact</a>
              <a href="#footer" onClick={(e) => handleNavClick(e, 'footer')} className="text-gray-700 hover:text-indigo-600 transition duration-300">Footer</a> {/* Added Footer link */}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Navigation;
