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
    <section id="home" className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Sunset hero card */}
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] shadow-2xl shadow-orange-500/20 border-8 border-white bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500">
          {/* Decorative sunset elements */}
          <div className="absolute -top-24 -right-24 w-80 h-80 md:w-96 md:h-96 bg-yellow-300 rounded-full blur-3xl opacity-60 gpu-layer-opacity" />
          <div className="absolute top-24 right-1/4 w-32 h-16 bg-white/30 backdrop-blur-md rounded-full motion-safe:animate-float [animation-delay:0.5s] gpu-layer" />
          <div className="absolute top-12 left-12 w-24 h-12 bg-white/40 backdrop-blur-md rounded-full motion-safe:animate-float [animation-delay:1s] gpu-layer" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none" />

          {/* Ground/hills layer */}
          <div className="absolute bottom-0 w-full flex items-end justify-between px-4 pointer-events-none">
            <div className="w-32 h-32 bg-orange-600/30 rounded-t-full blur-xl" />
            <div className="w-48 h-24 bg-rose-700/20 rounded-t-full blur-lg translate-y-4" />
            <div className="w-40 h-40 bg-purple-800/20 rounded-t-full blur-2xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-10rem)] p-6 sm:p-10 lg:p-16">
            {/* Content */}
            <div className="space-y-6 max-w-xl order-2 lg:order-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-300 text-orange-900 px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm font-bold uppercase tracking-widest">Magical Stories for Kids</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_0_rgba(190,18,60,0.4)]">
                Discover Bible Stories with{' '}
                <span className="text-amber-100">Maggie</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-orange-50 leading-relaxed font-medium">
                Beautiful, illustrated Bible stories narrated by Maggie the dog. Perfect for bedtime reading,
                family devotions, and nurturing faith in young hearts.
              </p>

              {/* Kid-facing greeting + big kid CTAs */}
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-5 space-y-4">
                <p className="text-lg md:text-xl font-display font-semibold text-white">
                  Hi! I'm Maggie 🐾 Want to hear a Bible story?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white hover:bg-orange-50 text-rose-600 font-bold px-6 h-16 text-lg flex-1 rounded-2xl shadow-[0_6px_0_#e11d48] hover:shadow-[0_3px_0_#e11d48] hover:translate-y-[3px] transition-all"
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
                    className="font-bold px-6 h-16 text-lg flex-1 border-2 border-white/50 text-white hover:bg-white/20 hover:text-white rounded-2xl"
                  >
                    <Link to="/ask-maggie">
                      <MessageCircle className="w-6 h-6 mr-2" />
                      Ask Maggie
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Reading Club CTA */}
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">📚 Join Maggie's Reading Club</p>
                  <p className="text-sm text-orange-100">Read every book online with read-aloud — 7-day free trial.</p>
                </div>
                <Button size="lg" className="font-bold whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] transition-all" onClick={handleReadingClubClick}>
                  Try Free
                </Button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-medium px-8 h-14 text-base border-2 border-white/50 text-white hover:bg-white/20 hover:text-white rounded-2xl"
                  onClick={() => scrollToSection('books')}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Our Books
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-medium px-8 h-14 text-base border-2 border-white/50 text-white hover:bg-white/20 hover:text-white rounded-2xl"
                  onClick={() => scrollToSection('write-to-maggie')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Write to Maggie
                </Button>
              </div>

              {/* Secondary CTA */}
              <div className="pt-2">
                <Link
                  to="/ask-maggie"
                  className="inline-flex items-center gap-2 text-white hover:text-amber-100 font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ask Maggie a Bible Question
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/30">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">5.0</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-300 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-orange-100">Amazon Rating</span>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">6+</span>
                  <span className="text-sm text-orange-100">Books Published</span>
                </div>
                <div className="h-12 w-px bg-white/30 hidden sm:block" />
                <div className="flex-col hidden sm:flex">
                  <span className="text-2xl font-bold text-white">3</span>
                  <span className="text-sm text-orange-100">Languages</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative flex justify-center lg:justify-start order-1 lg:order-2 pt-4 lg:pt-12">
              <div className="relative">
                {/* Main image container */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 motion-safe:animate-float gpu-layer">
                  <div className="absolute inset-0 rounded-full bg-white/20 motion-safe:animate-pulse-slow gpu-layer-opacity" />
                  <a
                    href="#maggie"
                    className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-2xl block group transform-gpu transition-transform duration-500 ease-out hover:scale-105 hover:-rotate-1"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('maggie');
                    }}
                  >
                    <img
                      src="/lovable-uploads/MaggieNewNBP.png"
                      alt="Maggie the dog - Your faith adventure guide"
                      className="w-full h-full object-cover object-top transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="eager"
                      decoding="async"
                    />

                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-300 text-orange-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      Meet Maggie!
                    </div>
                  </a>

                  {/* Matteo - puppy successor */}
                  <Link
                    to="/matteo"
                    aria-label="Meet Matteo the Yorkie puppy"
                    className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-32 h-32 md:w-44 md:h-44 block group motion-safe:animate-float [animation-delay:1.2s] gpu-layer"
                  >
                    <div className="absolute inset-0 rounded-full bg-white/30 transform-gpu transition-transform duration-500 ease-out group-hover:scale-110" />
                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center transform-gpu transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-2">
                      <img
                        src="/lovable-uploads/MatteoFront.png"
                        alt="Matteo the puppy - Maggie's successor"
                        className="w-[85%] h-[85%] object-contain transform-gpu transition-transform duration-700 ease-out group-hover:scale-110 motion-safe:group-hover:animate-wiggle"
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      Meet Matteo!
                    </div>
                  </Link>
                </div>
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
