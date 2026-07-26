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
    <section id="home" className="relative pt-28 pb-20 overflow-hidden bg-background">
      {/* Depth glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[38rem] h-[38rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 right-0 w-[34rem] h-[34rem] rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Masthead rule */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <span className="magazine-eyebrow text-xs md:text-sm text-secondary">
            Issue No. 1 — Faith-Based Children's Stories
          </span>
          <span className="magazine-eyebrow text-xs md:text-sm text-muted-foreground">
            Booksbymaggie.com
          </span>
        </div>

        <div className="magazine-card rounded-3xl mt-8 p-6 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Editorial column */}
            <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-1.5 rounded-full">
                <span className="magazine-eyebrow text-[0.7rem] text-accent-foreground">
                  Read Aloud · Illustrated · Bible Stories
                </span>
              </div>

              <h1 className="font-display font-extrabold text-foreground text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                Discover Bible
                <br />
                Stories with{' '}
                <span className="text-secondary">Maggie</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Beautiful, illustrated Bible stories narrated by Maggie the dog — made for
                bedtime reading, family devotions, and nurturing faith in young hearts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-16 text-lg rounded-full"
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
                  className="font-bold px-8 h-16 text-lg rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                >
                  <Link to="/ask-maggie">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Ask Maggie
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('books')}
                  className="inline-flex items-center gap-2 text-foreground/90 hover:text-secondary font-semibold transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Our Books
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('write-to-maggie')}
                  className="inline-flex items-center gap-2 text-foreground/90 hover:text-secondary font-semibold transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Write to Maggie
                </button>
              </div>

              {/* Editorial stats row */}
              <div className="grid grid-cols-3 gap-6 pt-8 magazine-rule">
                <div className="pt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-display font-extrabold text-foreground">5.0</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-accent fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="magazine-eyebrow text-[0.65rem] text-muted-foreground">Amazon Rating</span>
                </div>
                <div className="pt-6">
                  <span className="block text-3xl font-display font-extrabold text-foreground">6+</span>
                  <span className="magazine-eyebrow text-[0.65rem] text-muted-foreground">Books Published</span>
                </div>
                <div className="pt-6">
                  <span className="block text-3xl font-display font-extrabold text-foreground">3</span>
                  <span className="magazine-eyebrow text-[0.65rem] text-muted-foreground">Languages</span>
                </div>
              </div>
            </div>

            {/* Porthole column */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative mx-auto w-72 h-72 md:w-[26rem] md:h-[26rem]">
                {/* Rotating accent ring */}
                <div className="absolute -inset-3 rounded-full border-2 border-dashed border-secondary/40 animate-spin-slow" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/20" />
                <a
                  href="#maggie"
                  className="absolute inset-3 rounded-full overflow-hidden border-4 border-secondary/60 shadow-magazine block group"
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
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground magazine-eyebrow text-[0.6rem] px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    Meet Maggie
                  </span>
                </a>

                {/* Matteo porthole */}
                <Link
                  to="/matteo"
                  aria-label="Meet Matteo the Yorkie puppy"
                  className="absolute -bottom-6 -right-2 md:-bottom-8 md:-right-6 w-36 h-36 md:w-44 md:h-44 block group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-secondary/60 shadow-magazine bg-card flex items-center justify-center">
                    <img
                      src="/lovable-uploads/MatteoFront.png"
                      alt="Matteo the puppy - Maggie's successor"
                      className="w-[85%] h-[85%] object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground magazine-eyebrow text-[0.6rem] px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    Meet Matteo
                  </span>
                </Link>
              </div>

              {/* Floating chat bubble */}
              <div className="magazine-surface rounded-2xl p-5 mt-12 lg:mt-16">
                <p className="text-lg font-display font-bold text-foreground">
                  Hi! I'm Maggie 🐾
                </p>
                <p className="text-base text-muted-foreground mt-1">
                  Want to hear a Bible story? Tap “Read a Story” and let's begin.
                </p>
              </div>

              {/* Floating Reading Club card */}
              <div className="magazine-surface rounded-2xl p-5 mt-4 border-l-4 border-l-accent">
                <span className="magazine-eyebrow text-[0.65rem] text-accent">Membership</span>
                <p className="font-display font-bold text-foreground text-lg mt-1">
                  Maggie's Reading Club
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Read every book online with read-aloud — 7-day free trial.
                </p>
                <Button
                  size="lg"
                  className="mt-4 w-full font-bold rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleReadingClubClick}
                >
                  Try Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Reading Club subscription check modal */}
      <Dialog open={showReadingClubModal} onOpenChange={setShowReadingClubModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Maggie's Reading Club</DialogTitle>
            <DialogDescription>
              Let's check your account so we can get you to the right place.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isChecking ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking your account...</span>
              </div>
            ) : !user ? (
              <div className="space-y-3">
                <p className="text-foreground font-medium">
                  Sign in first and we'll check whether you already have a Reading Club subscription.
                </p>
              </div>
            ) : isActive ? (
              <div className="space-y-3">
                <p className="text-foreground font-medium">
                  You already have an active subscription. Enjoy the library!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground font-medium">
                  You don't have an active subscription yet. Start your 7-day free trial today.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            {isChecking ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : !user ? (
              <Button onClick={handleSignIn}>Sign In</Button>
            ) : isActive ? (
              <Button onClick={handleGoToLibrary}>Go to Library</Button>
            ) : (
              <Button onClick={handleStartTrial}>Start Free Trial</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
