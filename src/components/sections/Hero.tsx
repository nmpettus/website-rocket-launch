import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="space-y-8 max-w-xl order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-primary">Faith-Based Children's Books</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
              Discover Bible Stories with{' '}
              <span className="text-primary">Maggie</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Beautiful, illustrated Bible stories narrated by Maggie the dog. Perfect for bedtime reading, 
              family devotions, and nurturing faith in young hearts.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 h-14 text-base"
                onClick={() => scrollToSection('books')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Our Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="font-medium px-8 h-14 text-base border-2"
                onClick={() => scrollToSection('write-to-maggie')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Write to Maggie
              </Button>
            </div>
            
            {/* Secondary CTA */}
            <div className="pt-4">
              <Link 
                to="/ask-maggie"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Ask Maggie a Bible Question
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-6 border-t border-border">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">5.0</span>
                <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Amazon Rating</span>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">6+</span>
                <span className="text-sm text-muted-foreground">Books Published</span>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex-col hidden sm:flex">
                <span className="text-2xl font-bold text-foreground">3</span>
                <span className="text-sm text-muted-foreground">Languages</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-start order-1 lg:order-2 lg:-mt-8">
            <div className="relative">
              {/* Main image container */}
              <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                  <img 
                    src="/lovable-uploads/MaggieNewNBP.png"
                    alt="Maggie the dog - Your faith adventure guide"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
