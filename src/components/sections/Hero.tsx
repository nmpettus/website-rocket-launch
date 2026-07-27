import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Palette, Sparkles, MessageCircle, ArrowRight, Loader2, Star } from "lucide-react";
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

const Cloud = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 80" aria-hidden="true" className={className}>
    <path
      fill="currentColor"
      d="M52 72c-19 0-34-13-34-29S33 14 52 14c7-9 18-14 30-14 20 0 37 13 42 31 17 1 30 14 30 29 0 6-2 8-6 12H52z"
    />
  </svg>
);

const Hero = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const [showReadingClubModal, setShowReadingClubModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    <section
      id="home"
      className="relative pt-32 pb-20 overflow-hidden gradient-sky"
    >
      {/* Drifting clouds */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-24 h-64 overflow-hidden">
        <Cloud className="absolute top-0 w-40 text-background/80 animate-drift-slow" />
        <Cloud className="absolute top-24 w-28 text-background/60 animate-drift-slower" />
      </div>

      {/* Soft hills */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 160" className="w-full h-24 md:h-32" preserveAspectRatio="none">
          <path d="M0 96c220-56 420 24 640 8s400-88 800-40v96H0z" fill="hsl(var(--softgreen))" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Content */}
          <div className="space-y-8 max-w-xl order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">
                Welcome to the wonderful world of Maggie
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
              Where Stories Grow{" "}
              <span className="text-gradient-brand">Faith, Curiosity &amp; Kind Hearts</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              Children's books, activities, coloring pages, videos, and adventures that help young
              hearts discover God, kindness, purpose, and the amazing world around them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-16 px-8 text-lg font-bold rounded-full glow-accent"
                onClick={() => scrollToSection("books")}
              >
                <BookOpen className="w-6 h-6 mr-2" aria-hidden="true" />
                Explore the Books
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-8 text-lg font-bold rounded-full border-2 border-primary text-primary bg-card hover:bg-primary hover:text-primary-foreground"
                onClick={() => scrollToSection("activities")}
              >
                <Palette className="w-6 h-6 mr-2" aria-hidden="true" />
                Free Activities
              </Button>
            </div>

            {/* Reading Club CTA */}
            <div className="gradient-warm rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-soft">
              <div className="flex-1">
                <p className="font-display font-bold text-foreground text-xl">
                  Join Maggie's Reading Club
                </p>
                <p className="text-base text-foreground/75">
                  Read every book online with read-aloud narration — 7-day free trial.
                </p>
              </div>
              <Button
                size="lg"
                className="font-bold rounded-full whitespace-nowrap bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => setShowReadingClubModal(true)}
              >
                Try Free
              </Button>
            </div>

            <Link
              to="/ask-maggie"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Ask Maggie a Bible Question
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-6 border-t border-border">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-foreground">5.0</span>
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                <span className="text-sm text-foreground/70">Amazon Rating</span>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-foreground">6+</span>
                <span className="text-sm text-foreground/70">Books Published</span>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex-col hidden sm:flex">
                <span className="text-2xl font-display font-bold text-foreground">3</span>
                <span className="text-sm text-foreground/70">Languages</span>
              </div>
            </div>
          </div>

          {/* Characters */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] animate-float-soft">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 via-accent/20 to-secondary/20" />
              <button
                type="button"
                onClick={() => scrollToSection("maggie")}
                aria-label="Meet Maggie"
                className="absolute inset-4 rounded-full overflow-hidden border-8 border-card shadow-lift"
              >
                <img
                  src="/lovable-uploads/MaggieNewNBP.png"
                  alt="Maggie the Yorkie, storyteller and guide"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  Meet Maggie!
                </span>
              </button>

              <Link
                to="/matteo"
                aria-label="Meet Matteo the Yorkie puppy"
                className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 w-40 h-40 md:w-52 md:h-52 block group animate-wave"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-primary/20 transition-transform group-hover:scale-105" />
                <div className="absolute inset-2 rounded-full overflow-hidden border-8 border-card shadow-lift bg-card flex items-center justify-center">
                  <img
                    src="/lovable-uploads/MatteoFront.png"
                    alt="Matteo the Yorkie puppy"
                    className="w-[85%] h-[85%] object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  Meet Matteo!
                </span>
              </Link>
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
              <p className="text-foreground font-medium">
                Sign in first and we'll check whether you already have a Reading Club subscription.
              </p>
            ) : isActive ? (
              <p className="text-foreground font-medium">
                You already have an active subscription. Enjoy the library!
              </p>
            ) : (
              <p className="text-foreground font-medium">
                You don't have an active subscription yet. Start your 7-day free trial today.
              </p>
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
