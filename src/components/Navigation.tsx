import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { id: 'home', label: 'Home', isRoute: false },
  { id: 'about', label: 'About', isRoute: true, route: '/about' },
  { id: 'apps', label: 'Apps', isRoute: true, route: 'https://apps.booksbymaggie.com', isExternal: true },
  { id: 'online-books', label: 'Online Books', isRoute: true, route: 'https://booksbymaggie.com/heroes', isExternal: true },
  { id: 'ai-adventures', label: 'AI Adventures', isRoute: true, route: '/maggies-ai-adventures' },
  { id: 'maggie', label: 'Meet Maggie', isRoute: false },
  { id: 'videos', label: 'Videos', isRoute: true, route: '/videos' },
  { id: 'activities', label: 'Activities', isRoute: false },
  { id: 'games', label: 'Games', isRoute: false },
  { id: 'newsletter', label: 'Newsletter', isRoute: false },
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
      "fixed top-10 left-0 right-0 z-40 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <img 
              src="/lovable-uploads/MaggieNewNBP.png" 
              alt="Maggie the dog logo" 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300" 
            />
            <span className="text-lg font-display font-semibold text-foreground tracking-tight whitespace-nowrap">
              Books By Maggie
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {NAV_LINKS.map(link => (
              link.isExternal ? (
                <a 
                  key={link.id}
                  href={link.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1.5 text-xs font-medium transition-colors duration-200 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
              ) : link.isRoute && link.route ? (
                <Link 
                  key={link.id}
                  to={link.route}
                  className={cn(
                    "px-2 py-1.5 text-xs font-medium transition-colors duration-200 rounded-lg",
                    isActiveLink(link)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                    "px-2 py-1.5 text-xs font-medium transition-colors duration-200 rounded-lg",
                    isActiveLink(link)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </a>
              )
            ))}
            
            {/* Shop Books CTA */}
            <Button 
              className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-1.5 text-xs rounded-lg transition-colors duration-200"
              onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Shop Books
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-background border-l border-border">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b border-border">
                    <Link to="/" className="flex items-center space-x-3">
                      <img 
                        src="/lovable-uploads/MaggieNewNBP.png" 
                        alt="Maggie the dog logo" 
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-border" 
                      />
                      <div className="flex flex-col">
                        <span className="text-lg font-display font-semibold text-foreground">
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
                        {link.isExternal ? (
                          <a 
                            href={link.route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-base py-3 px-4 rounded-lg transition-colors duration-200 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {link.label}
                          </a>
                        ) : link.isRoute && link.route ? (
                          <Link 
                            to={link.route}
                            className={cn(
                              "block text-base py-3 px-4 rounded-lg transition-colors duration-200 font-medium",
                              isActiveLink(link)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a 
                            href={`/#${link.id}`} 
                            onClick={(e) => handleNavClick(e, link)}
                            className={cn(
                              "block text-base py-3 px-4 rounded-lg transition-colors duration-200 font-medium",
                              isActiveLink(link)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {link.label}
                          </a>
                        )}
                      </SheetClose>
                    ))}
                  </nav>
                  
                  {/* Mobile Footer CTA */}
                  <div className="p-4 border-t border-border">
                    <SheetClose asChild>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg"
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
