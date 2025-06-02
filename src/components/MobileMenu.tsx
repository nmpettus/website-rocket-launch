
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80; // Approximate height of navbar
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
      
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex flex-col">
      <div className="bg-white w-full p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
            <span className="text-2xl font-bold text-indigo-600 font-['Comic_Neue']">Maggie's Books</span>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-4">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Home
          </a>
          <a 
            href="#books" 
            onClick={(e) => handleNavClick(e, 'books')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Books
          </a>
          <a 
            href="#maggie" 
            onClick={(e) => handleNavClick(e, 'maggie')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Meet Maggie
          </a>
          <a 
            href="#activities" 
            onClick={(e) => handleNavClick(e, 'activities')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Activities
          </a>
          <a 
            href="#projects" 
            onClick={(e) => handleNavClick(e, 'projects')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Future Projects
          </a>
          <a 
            href="#newsletter" 
            onClick={(e) => handleNavClick(e, 'newsletter')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Join
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className="text-xl py-2 border-b border-gray-200 text-gray-800 hover:text-indigo-600"
          >
            Contact
          </a>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
