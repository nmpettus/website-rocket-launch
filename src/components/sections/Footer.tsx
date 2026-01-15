import React from "react";
import { Facebook, Instagram, Heart } from "lucide-react";
import { booksData } from "@/data/bookReviews";
import { Link } from "react-router-dom";

const Footer = () => {
  const godsLoveBook = booksData.find(book => book.id === "gods-love");
  const creationBook = booksData.find(book => book.id === "creation");
  const noahBook = booksData.find(book => book.id === "noah");
  const jonahBook = booksData.find(book => book.id === "jonah");
  
  const spanishVersionLink = "https://a.co/d/6ZbpRHg";
  const italianVersionLink = "https://a.co/d/f0xPfeW";

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
    <footer id="footer" className="bg-charcoal text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
                alt="Maggie logo" 
                className="h-14 w-14 rounded-full object-cover ring-2 ring-sage/30" 
              />
              <div>
                <span className="text-xl font-display font-semibold block">Books By Maggie</span>
                <span className="text-xs text-white/60">Faith-Based Stories</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Bringing joy to children through heartwarming Bible stories, narrated by Maggie the dog. 
              Perfect for family reading and growing in faith together.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61577214954344" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sage flex items-center justify-center transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/nmpettus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sage flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/nmpettus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sage flex items-center justify-center transition-colors duration-300"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-6">Navigate</h3>
            <ul className="space-y-3">
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-white/60 hover:text-sage transition-colors text-sm">Home</a></li>
              <li><a href="#books" onClick={(e) => handleNavClick(e, 'books')} className="text-white/60 hover:text-sage transition-colors text-sm">Our Books</a></li>
              <li><a href="#maggie" onClick={(e) => handleNavClick(e, 'maggie')} className="text-white/60 hover:text-sage transition-colors text-sm">Meet Maggie</a></li>
              <li><Link to="/videos" className="text-white/60 hover:text-sage transition-colors text-sm">Videos</Link></li>
              <li><a href="#activities" onClick={(e) => handleNavClick(e, 'activities')} className="text-white/60 hover:text-sage transition-colors text-sm">Activities</a></li>
              <li><a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="text-white/60 hover:text-sage transition-colors text-sm">Games</a></li>
              <li><a href="#newsletter" onClick={(e) => handleNavClick(e, 'newsletter')} className="text-white/60 hover:text-sage transition-colors text-sm">Newsletter</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white/60 hover:text-sage transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
          
          {/* Books */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-6">Our Books</h3>
            <ul className="space-y-3">
              <li><a href={godsLoveBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">God's Love</a></li>
              <li><a href={creationBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">Creation</a></li>
              <li><a href={noahBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">Noah's Ark</a></li>
              <li><a href={jonahBook?.amazonLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">Jonah</a></li>
              <li><a href={spanishVersionLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">Spanish Edition</a></li>
              <li><a href={italianVersionLink} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-sage transition-colors text-sm">Italian Edition</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-white/60 hover:text-sage transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-white/60 hover:text-sage transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-white/60 hover:text-sage transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Books By Maggie. All rights reserved.
            </p>
            <p className="text-white/50 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-rose fill-rose" /> for families everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
