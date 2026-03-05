import React from "react";
import { Facebook, Instagram, Heart } from "lucide-react";
import { booksData } from "@/data/bookReviews";
import { Link } from "react-router-dom";

const Footer = () => {
  const bookLinks = booksData.map(book => ({
    id: book.id,
    title: book.id === "gods-love" ? "God's Love" :
           book.id === "creation" ? "Creation" :
           book.id === "noah" ? "Noah's Ark" :
           book.id === "jonah" ? "Jonah" :
           book.id === "thanksgiving" ? "Thanksgiving" :
           book.id === "christmas" ? "Christmas" :
           book.id === "ai-adventures" ? "AI Adventures" :
           book.id === "easter" ? "Easter Story (Free)" :
           book.title,
    url: book.id === "easter" ? "/books/easter" :
         book.amazonLink || "#",
    isInternal: book.id === "easter",
    isFree: book.isFree
  }));

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

  return (
    <footer id="footer" className="bg-foreground text-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
                alt="Maggie logo" 
                className="h-12 w-12 rounded-full object-cover ring-2 ring-background/20" 
              />
              <div>
                <span className="text-lg font-display font-semibold block">Books By Maggie</span>
                <span className="text-xs text-background/60">Faith-Based Stories</span>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Bringing joy to children through heartwarming Bible stories, narrated by Maggie the dog. 
              Perfect for family reading and growing in faith together.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61577214954344" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/nmpettus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/nmpettus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/90 mb-6">Navigate</h3>
            <ul className="space-y-3">
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-background/60 hover:text-background transition-colors text-sm">Home</a></li>
              <li><a href="#books" onClick={(e) => handleNavClick(e, 'books')} className="text-background/60 hover:text-background transition-colors text-sm">Our Books</a></li>
              <li><a href="#maggie" onClick={(e) => handleNavClick(e, 'maggie')} className="text-background/60 hover:text-background transition-colors text-sm">Meet Maggie</a></li>
              <li><Link to="/videos" className="text-background/60 hover:text-background transition-colors text-sm">Videos</Link></li>
              <li><a href="#activities" onClick={(e) => handleNavClick(e, 'activities')} className="text-background/60 hover:text-background transition-colors text-sm">Activities</a></li>
              <li><a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="text-background/60 hover:text-background transition-colors text-sm">Games</a></li>
              <li><a href="#newsletter" onClick={(e) => handleNavClick(e, 'newsletter')} className="text-background/60 hover:text-background transition-colors text-sm">Newsletter</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-background/60 hover:text-background transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
          
          {/* Books */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/90 mb-6">Our Books</h3>
            <ul className="space-y-3">
              {bookLinks.map(book => (
                <li key={book.id}>
                  {book.isInternal ? (
                    <Link to={book.url} className="text-background/60 hover:text-background transition-colors text-sm">
                      {book.title}
                    </Link>
                  ) : (
                    <a href={book.url} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition-colors text-sm">
                      {book.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/90 mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-background/60 hover:text-background transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-background/60 hover:text-background transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-background/60 hover:text-background transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © {new Date().getFullYear()} Books By Maggie. All rights reserved.
            </p>
            <p className="text-background/50 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-secondary fill-secondary" /> for families everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
