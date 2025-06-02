
import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { booksData } from "@/data/bookReviews";

const Footer = () => {
  // Find the Creation book (first book)
  const creationBook = booksData.find(book => book.id === "creation");
  
  // Find the Noah book (second book)
  const noahBook = booksData.find(book => book.id === "noah");
  
  // Find the Jonah book (third book)
  const jonahBook = booksData.find(book => book.id === "jonah");
  
  // Direct links to Spanish and Italian versions
  const spanishVersionLink = "https://a.co/d/6ZbpRHg";
  const italianVersionLink = "https://a.co/d/f0xPfeW";

  // Handle smooth scrolling to sections
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
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie logo" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-xl font-bold font-['Comic_Neue']">Maggie's Books</span>
            </div>
            <p className="text-gray-400">Bringing joy to children through delightful stories narrated by Maggie the dog.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#books" onClick={(e) => handleNavClick(e, 'books')} className="text-gray-400 hover:text-white transition duration-300">Books</a></li>
              <li><a href="#maggie" onClick={(e) => handleNavClick(e, 'maggie')} className="text-gray-400 hover:text-white transition duration-300">Meet Maggie</a></li>
              <li><a href="#activities" onClick={(e) => handleNavClick(e, 'activities')} className="text-gray-400 hover:text-white transition duration-300">Activities</a></li>
              <li><a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-gray-400 hover:text-white transition duration-300">Future Projects</a></li>
              <li><a href="#newsletter" onClick={(e) => handleNavClick(e, 'newsletter')} className="text-gray-400 hover:text-white transition duration-300">Join</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Our Books</h3>
            <ul className="space-y-2">
              <li><a href={creationBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Creation as told by Maggie</a></li>
              <li><a href={noahBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Noah's Ark as told by Maggie</a></li>
              <li><a href={jonahBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Jonah as told by Maggie</a></li>
              <li><a href={spanishVersionLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Spanish Version</a></li>
              <li><a href={italianVersionLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">Italian Version</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2023 Maggie's Books. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
