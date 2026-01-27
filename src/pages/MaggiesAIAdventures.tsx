import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Mail, Clock, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sendEmail, EMAIL_TEMPLATES } from "@/utils/titanEmailUtils";
import { useSEO } from "@/hooks/useSEO";

const MaggiesAIAdventures = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set launch date - adjust as needed
  const launchDate = new Date("2026-02-12T00:00:00");

  useSEO({
    title: "Maggie's AI Adventures - Coming Soon! | Books by Maggie",
    description: "Join Maggie on her newest adventure exploring AI! Be the first to know when this exciting new children's book launches.",
    keywords: ["AI Adventures", "Maggie", "children's book", "technology for kids", "faith-based"],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendEmail(EMAIL_TEMPLATES.NEWSLETTER, {
        source: "AI Adventures Launch Signup",
        email: email
      }, email);

      if (result.success) {
        toast.success("🎉 You're on the list! We'll notify you when the book launches!");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border-2 border-primary/20">
      <span className="text-3xl md:text-5xl font-display font-bold text-primary">{value}</span>
      <span className="text-sm md:text-base text-muted-foreground font-medium">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] text-4xl animate-float opacity-60">✨</div>
        <div className="absolute top-40 right-[15%] text-3xl animate-float opacity-50" style={{ animationDelay: '1s' }}>🤖</div>
        <div className="absolute bottom-40 left-[5%] text-3xl animate-float opacity-50" style={{ animationDelay: '2s' }}>📚</div>
        <div className="absolute bottom-20 right-[10%] text-4xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-1/2 left-[3%] text-2xl animate-float opacity-40" style={{ animationDelay: '1.5s' }}>🐾</div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-5 py-3 rounded-full border-2 border-accent/30 animate-bounce-in">
              <Sparkles className="w-5 h-5 text-accent animate-sparkle" />
              <span className="text-sm font-bold text-foreground">🚀 Coming Soon!</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl md:text-5xl font-display font-bold text-center text-foreground mb-4">
            Maggie's Newest Adventure Launches in{" "}
            <span className="text-primary">{timeLeft.days} Days!</span>
          </h1>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12">
            <CountdownBox value={timeLeft.days} label="Days" />
            <CountdownBox value={timeLeft.hours} label="Hours" />
            <CountdownBox value={timeLeft.minutes} label="Mins" />
            <CountdownBox value={timeLeft.seconds} label="Secs" />
          </div>

          {/* Book cover - full spread with front and back */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl opacity-50" />
              <img
                src="/lovable-uploads/ai-adventures-cover-full.png"
                alt="Maggie's AI Adventure - Full Book Cover with Front and Back"
                className="relative w-full rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Book description and signup */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-display font-bold text-foreground">What You'll Learn</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Join Maggie on an exciting journey into the world of Artificial Intelligence! 
                  This magical adventure teaches kids that AI is a wonderful tool created by people, 
                  and that God gives us the wisdom to use technology for good.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Perfect for curious minds ages 4-8, this book combines faith-based lessons with 
                  fun, age-appropriate explanations of how AI works and helps us every day! 🤖✨
                </p>
              </div>

              {/* Email signup */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-display font-bold text-foreground">Be the First to Know!</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign up to get notified when the book launches and receive exclusive early-bird offers!
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-background/80"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-3d bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    {isSubmitting ? "Signing up..." : "Notify Me! 🔔"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Author section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-secondary/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-lg opacity-50" />
                <img
                  src="/lovable-uploads/norm-and-maggie.jpeg"
                  alt="Norm and Maggie"
                  className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-xl border-4 border-secondary/50"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Heart className="w-5 h-5 text-secondary animate-heartbeat" />
                  <span className="text-sm font-medium text-secondary">Meet the Team</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  Norm & Maggie
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Norm and his adorable pup Maggie work together to create faith-filled adventures 
                  that spark curiosity and wonder in young readers. When they're not writing, 
                  you can find them exploring new ideas and sharing God's love through stories! 🐾💜
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaggiesAIAdventures;
