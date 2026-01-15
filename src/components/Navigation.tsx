import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { id: 'home', label: 'Home', isRoute: false },
  { id: 'books', label: 'Books', isRoute: false },
  { id: 'maggie', label: 'Meet Maggie', isRoute: false },
  { id: 'videos', label: 'Videos', isRoute: true, route: '/videos' },
  { id: 'activities', label: 'Activities', isRoute: false },
  { id: 'games', label: 'Games', isRoute: false },
  { id: 'newsletter', label: 'Join', isRoute: false },
  { id: 'contact', label: 'Contact', isRoute: false },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[0]) => {
    if (link.isRoute) {
      return;
    }
    
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate(`/#${link.id}`);
      return;
    }
    
    const section = document.getElementById(link.id);
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
    if (location.pathname === '/') {
      if (location.hash) {
        window.history.replaceState(null, '', '/');
      }
      
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      setActiveSection('home');
      setIsInitialLoad(false);
    } else {
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.hash && !isInitialLoad) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const navbarHeight = 80;
          const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location, isInitialLoad]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      if (location.pathname !== '/' || isInitialLoad) {
        setActiveSection('');
        return;
      }

      const sections = NAV_LINKS.filter(link => !link.isRoute).map(link => document.getElementById(link.id));
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
        currentSection = 'contact';
      }

      if (activeSection !== currentSection && currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, location.pathname, isInitialLoad]);

  const isActiveLink = (link: typeof NAV_LINKS[0]) => {
    if (link.isRoute && link.route) {
      return location.pathname === link.route;
    }
    return activeSection === link.id && location.pathname === '/';
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      isScrolled 
        ? "bg-cream/95 backdrop-blur-md shadow-elegant border-b border-sage/10" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
              alt="Maggie the dog logo" 
              className="h-12 w-12 rounded-full object-cover ring-2 ring-sage/30 group-hover:ring-sage transition-all duration-300" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-display font-semibold text-charcoal tracking-tight">
                Books By Maggie
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Faith-Based Stories for Children
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map(link => (
              link.isRoute && link.route ? (
                <Link 
                  key={link.id}
                  to={link.route}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    isActiveLink(link)
                      ? "text-sage-dark bg-sage-light"
                      : "text-charcoal/70 hover:text-charcoal hover:bg-sage-light/50"
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a 
                  key={link.id}
                  href={`/#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link)} 
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    isActiveLink(link)
                      ? "text-sage-dark bg-sage-light"
                      : "text-charcoal/70 hover:text-charcoal hover:bg-sage-light/50"
                  )}
                >
                  {link.label}
                </a>
              )
            ))}
            
            {/* Shop Books CTA */}
            <Button 
              className="ml-4 bg-sage hover:bg-sage-dark text-white font-medium px-5 py-2 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
              onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Shop Books
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-charcoal hover:bg-sage-light">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-cream border-l border-sage/20">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b border-sage/10 bg-sage-light/30">
                    <Link to="/" className="flex items-center space-x-3">
                      <img 
                        src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" 
                        alt="Maggie the dog logo" 
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-sage/30" 
                      />
                      <div className="flex flex-col">
                        <span className="text-lg font-display font-semibold text-charcoal">
                          Books By Maggie
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Faith-Based Stories
                        </span>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col p-4 space-y-1 flex-1">
                    {NAV_LINKS.map(link => (
                      <SheetClose asChild key={link.id}>
                        {link.isRoute && link.route ? (
                          <Link 
                            to={link.route}
                            className={cn(
                              "block text-base py-3 px-4 rounded-xl transition-all duration-200 font-medium",
                              isActiveLink(link)
                                ? "bg-sage text-white"
                                : "text-charcoal/80 hover:bg-sage-light hover:text-charcoal"
                            )}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a 
                            href={`/#${link.id}`} 
                            onClick={(e) => handleNavClick(e, link)}
                            className={cn(
                              "block text-base py-3 px-4 rounded-xl transition-all duration-200 font-medium",
                              isActiveLink(link)
                                ? "bg-sage text-white"
                                : "text-charcoal/80 hover:bg-sage-light hover:text-charcoal"
                            )}
                          >
                            {link.label}
                          </a>
                        )}
                      </SheetClose>
                    ))}
                  </nav>
                  
                  {/* Mobile Footer CTA */}
                  <div className="p-4 border-t border-sage/10">
                    <SheetClose asChild>
                      <Button 
                        className="w-full bg-sage hover:bg-sage-dark text-white font-medium py-3 rounded-full"
                        onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Shop Books
                      </Button>
                    </SheetClose>
                  </div>
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
