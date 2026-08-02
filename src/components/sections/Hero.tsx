import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
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
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-24 px-4 sm:px-8"
    >
      {/* Background ambient glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl gpu-layer-opacity" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl gpu-layer-opacity" />

      <div className="container mx-auto relative z-10">
        {/* Editorial hero card */}
        <div className="relative max-w-7xl mx-auto bg-card/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] shadow-2xl p-8 lg:p-16 overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left content column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Reading Club badge */}
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest font-body">
                  Join Maggie's Reading Club
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1]">
                Discover Bible Stories with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-primary italic">
                  Maggie
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-indigo-100/70 max-w-xl leading-relaxed font-body mx-auto lg:mx-0">
                Beautiful, illustrated Bible stories narrated by Maggie the dog. Perfect for bedtime reading,
                family devotions, and nurturing faith in young hearts.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-14 text-base rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105"
                >
                  <Link to="/online-library">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read a Story
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-bold px-8 h-14 text-base rounded-2xl border-white/10 text-white hover:bg-white/5 hover:text-white"
                >
                  <Link to="/ask-maggie">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Ask Maggie
                  </Link>
                </Button>
              </div>

              {/* Reading Club CTA */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-xl mx-auto lg:mx-0">
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-lg font-heading">📚 Join Maggie's Reading Club</p>
                  <p className="text-sm text-indigo-200/60 font-body">
                    Read every book online with read-aloud — 7-day free trial.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="font-bold whitespace-nowrap bg-secondary hover:bg-secondary/90 text-white rounded-2xl"
                  onClick={handleReadingClubClick}
                >
                  Try Free
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 border-t border-white/10">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-indigo-900 flex items-center justify-center text-[10px] text-white font-body">
                    JD
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-indigo-700 flex items-center justify-center text-[10px] text-white font-body">
                    SK
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-card bg-primary flex items-center justify-center text-[10px] text-white font-body">
                    MR
                  </div>
                </div>
                <div className="text-sm text-indigo-200/60 font-body text-left">
                  <strong className="text-white block">Loved by 5,000+ families</strong>
                  Rated 5.0/5 stars for Bible storytelling
                </div>
              </div>
            </div>

            {/* Right visual column */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Magazine-style backdrop card */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background rounded-3xl rotate-3 shadow-2xl border border-white/5" />

                {/* Maggie card */}
                <a
                  href="#maggie"
                  onClick={(e) => {
                    e.preventDefault();
                    const section = document.getElementById('maggie');
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="absolute -top-6 -left-6 w-48 h-64 bg-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden transform -rotate-6 block group transition-transform duration-500 hover:-rotate-3 hover:scale-105"
                >
                  <img
                    src="/lovable-uploads/MaggieNewNBP.png"
                    alt="Maggie the dog - Your faith adventure guide"
                    className="w-full h-full object-cover object-top transform-gpu transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white font-bold text-xs uppercase tracking-tighter font-body">
                      Meet Maggie
                    </span>
                  </div>
                </a>

                {/* Matteo card */}
                <Link
                  to="/matteo"
                  aria-label="Meet Matteo the Yorkie puppy"
                  className="absolute bottom-10 -right-4 w-56 h-72 bg-secondary rounded-2xl border border-white/10 shadow-2xl overflow-hidden transform rotate-6 z-20 block group transition-transform duration-500 hover:rotate-3 hover:scale-105"
                >
                  <img
                    src="/lovable-uploads/MatteoFront.png"
                    alt="Matteo the puppy - Maggie's successor"
                    className="w-full h-full object-cover object-top transform-gpu transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <span className="text-white font-bold text-sm uppercase tracking-tighter font-body">
                      Adventures with Matteo
                    </span>
                  </div>
                </Link>

                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary opacity-20 blur-[80px] gpu-layer-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Club subscription check modal */}
      <Dialog open={showReadingClubModal} onOpenChange={setShowReadingClubModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-white">Maggie's Reading Club</DialogTitle>
            <DialogDescription className="text-indigo-200/60 font-body">
              Let's check your account so we can get you to the right place.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isChecking ? (
              <div className="flex items-center gap-3 text-muted-foreground font-body">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking your account...</span>
              </div>
            ) : !user ? (
              <div className="space-y-3">
                <p className="text-foreground font-medium font-body">
                  Sign in first and we'll check whether you already have a Reading Club subscription.
                </p>
              </div>
            ) : isActive ? (
              <div className="space-y-3">
                <p className="text-foreground font-medium font-body">
                  You already have an active subscription. Enjoy the library!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground font-medium font-body">
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
