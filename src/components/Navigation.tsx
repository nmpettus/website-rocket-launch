import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
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
  { id: 'projects', label: 'Projects', isRoute: false },
  { id: 'newsletter', label: 'Join', isRoute: false },
  { id: 'contact', label: 'Contact', isRoute: false },
  { id: 'footer', label: 'More', isRoute: false },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[0]) => {
    if (link.isRoute) {
      // Let React Router handle route navigation
      return;
    }
    
    e.preventDefault();
    
    // If we're not on the homepage, navigate to homepage first with the section hash
    if (location.pathname !== '/') {
      navigate(`/#${link.id}`);
      return;
    }
    
    // If we're on homepage, scroll to the section
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
    // On page load/reload, always scroll to top if we're on homepage
    if (location.pathname === '/') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto' // Use 'auto' for immediate scroll on page load
        });
        setActiveSection('home');
      }, 50);
    }
  }, []); // Empty dependency array means this runs only on component mount

  useEffect(() => {
    // Handle hash navigation when coming from other pages (but not on initial load)
    if (location.pathname === '/' && location.hash && activeSection !== '') {
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
  }, [location, activeSection]);

  useEffect(() => {
    // Only run scroll detection on homepage
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
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
        currentSection = 'footer';
      }

      if (activeSection !== currentSection && currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, location.pathname]);

  const isActiveLink = (link: typeof NAV_LINKS[0]) => {
    if (link.isRoute && link.route) {
      return location.pathname === link.route;
    }
    return activeSection === link.id && location.pathname === '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-40 border-b border-slate-200/80 transition-all duration-300">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
            <span className="text-2xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(link => (
              link.isRoute && link.route ? (
                <Link 
                  key={link.id}
                  to={link.route}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                    isActiveLink(link)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
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
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                    isActiveLink(link)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  {link.label}
                </a>
              )
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
                    <Link to="/" className="flex items-center space-x-2">
                      <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-10 w-10 rounded-full object-cover" />
                      <span className="text-xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
                    </Link>
                  </div>
                  
                  <nav className="flex flex-col space-y-1 p-4">
                    {NAV_LINKS.map(link => (
                      <SheetClose asChild key={link.id}>
                        {link.isRoute && link.route ? (
                          <Link 
                            to={link.route}
                            className={cn(
                              "block text-lg py-3 px-4 rounded-lg transition-all duration-200",
                              isActiveLink(link)
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            )}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a 
                            href={`/#${link.id}`} 
                            onClick={(e) => handleNavClick(e, link)}
                            className={cn(
                              "block text-lg py-3 px-4 rounded-lg transition-all duration-200",
                              isActiveLink(link)
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            )}
                          >
                            {link.label}
                          </a>
                        )}
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
