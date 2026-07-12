import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Hero = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const [showReadingClubModal, setShowReadingClubModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReadingClubClick = () => {
    setShowReadingClubModal(true);
  };

  const handleSignIn = () => {
    setShowReadingClubModal(false);
    navigate("/auth");
  };

  const handleGoToLibrary = () => {
    setShowReadingClubModal(false);
    navigate("/members");
  };

  const handleStartTrial = () => {
    setShowReadingClubModal(false);
    navigate("/join");
  };

  const isChecking = authLoading || subLoading;

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="space-y-8 max-w-xl order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-primary">Faith-Based Children's Books and Stories</span>
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

            {/* Kid-facing greeting + big kid CTAs */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 space-y-4">
              <p className="text-lg md:text-xl font-display font-semibold text-foreground">
                Hi! I'm Maggie 🐾 Want to hear a Bible story?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-16 text-lg flex-1 rounded-xl"
                >
                  <Link to="/online-library">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Read a Story
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-bold px-6 h-16 text-lg flex-1 border-2 border-primary text-primary hover:bg-primary/10 rounded-xl"
                >
                  <Link to="/ask-maggie">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Ask Maggie
                  </Link>
                </Button>
              </div>
            </div>

            {/* Reading Club CTA */}
            <div className="bg-gradient-to-r from-accent/20 to-primary/10 border-2 border-accent/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-foreground text-lg">📚 Join Maggie's Reading Club</p>
                <p className="text-sm text-muted-foreground">Read every book online with read-aloud — 7-day free trial.</p>
              </div>
              <Button size="lg" className="font-bold whitespace-nowrap" onClick={handleReadingClubClick}>
                Try Free
              </Button>
            </div>


            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                variant="outline"
                className="font-medium px-8 h-14 text-base border-2"
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
          <div className="relative flex justify-center lg:justify-start order-1 lg:order-2 pt-4 lg:pt-12">
            <div className="relative">
                {/* Main image container */}
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <a
                    href="#maggie"
                    className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-2xl block group"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('maggie');
                    }}
                  >
                    <img
                      src="/lovable-uploads/MaggieNewNBP.png"
                      alt="Maggie the dog - Your faith adventure guide"
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      Meet Maggie!
                    </div>
                  </a>

                {/* Matteo - puppy successor */}
                <Link
                  to="/matteo"
                  aria-label="Meet Matteo the Yorkie puppy"
                  className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-40 h-40 md:w-52 md:h-52 block group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-background shadow-xl bg-background flex items-center justify-center">
                    <img
                      src="/lovable-uploads/MatteoFront.png"
                      alt="Matteo the puppy - Maggie's successor"
                      className="w-[85%] h-[85%] object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    Meet Matteo!
                  </div>
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
