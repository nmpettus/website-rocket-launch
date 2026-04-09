import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Mail, Clock, BookOpen, Heart } from "lucide-react";
import artieImg from "@/assets/artie.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sendEmail, EMAIL_TEMPLATES } from "@/utils/titanEmailUtils";
import { useSEO } from "@/hooks/useSEO";

const MaggiesAIAdventures = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSince, setTimeSince] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Launch date
  const launchDate = new Date("2026-02-23T11:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - launchDate.getTime();

      if (distance > 0) {
        setTimeSince({
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
        <img src={artieImg} alt="Artie" className="absolute top-40 right-[15%] w-12 h-12 animate-float opacity-70" style={{ animationDelay: '1s' }} />
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
              <span className="text-sm font-bold text-foreground">🚀 Now Available!</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl md:text-5xl font-display font-bold text-center text-foreground mb-4">
            Maggie's Newest Adventure Launched{" "}
            <span className="text-primary">{timeSince.days} Days Ago!</span>
          </h1>

          {/* Count-up timer */}
          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12">
            <CountdownBox value={timeSince.days} label="Days" />
            <CountdownBox value={timeSince.hours} label="Hours" />
            <CountdownBox value={timeSince.minutes} label="Mins" />
            <CountdownBox value={timeSince.seconds} label="Secs" />
          </div>

          {/* Book cover - full spread with front and back */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl opacity-50" />
              <img
                src="/images/ai-adventure-cover.png"
                alt="Maggie's AI Adventure - Full Book Cover with Front and Back"
                className="relative w-full rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Book description - full width */}
          <div className="mb-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-bold text-foreground">What You'll Learn</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                Maggie the Yorkie and Riley the tech-curious kid team up with Artie the AI robot 
                to answer one big question: How do computers learn? Through laugh-out-loud moments 
                and mind-expanding discoveries, they unlock the secrets of pixels, patterns, and 
                what makes humans truly special! 🤖✨
              </p>
              
              {/* Key features - 2 column grid on larger screens */}
              <ul className="grid sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-muted-foreground"><strong className="text-foreground">Real STEM concepts</strong> explained through story</span>
                </li>
                <li className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-muted-foreground"><strong className="text-foreground">Activities, QR codes,</strong> and parent discussion guides</span>
                </li>
                <li className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-muted-foreground">Covers <strong className="text-foreground">AI ethics and empathy</strong> (not just the tech)</span>
                </li>
                <li className="flex items-start gap-3 bg-primary/5 rounded-xl p-4">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-muted-foreground">Perfect for <strong className="text-foreground">homeschoolers, classroom use,</strong> or family reading</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Email signup - full width */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 md:p-8 border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-display font-bold text-foreground">Join Our Newsletter!</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Sign up to get notified when the book launches and receive exclusive early-bird offers!
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
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

          {/* Author section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-secondary/30">
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-2xl blur-lg opacity-50" />
                <img
                  src="/lovable-uploads/our-team.jpeg"
                  alt="The Team: Norm, Marianna, Doreen, and Maggie the Yorkie"
                  className="relative w-full rounded-2xl shadow-xl border-4 border-secondary/50"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-secondary animate-heartbeat" />
                  <span className="text-sm font-medium text-secondary">Meet the Team</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  The Family Behind the Stories
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="font-bold text-foreground">Norm</p>
                    <p className="text-muted-foreground text-sm">Author & storyteller who brings faith-filled adventures to life</p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="font-bold text-foreground">Marianna</p>
                    <p className="text-muted-foreground text-sm">Wife & creative partner who keeps the inspiration flowing</p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="font-bold text-foreground">Doreen</p>
                    <p className="text-muted-foreground text-sm">Daughter & collaborator who helps bring fresh ideas to each story</p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="font-bold text-foreground">Maggie 🐾</p>
                    <p className="text-muted-foreground text-sm">The adorable Yorkie star & heart of every adventure</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mt-4">
                  Together, this family creates faith-filled adventures that spark curiosity and wonder in young readers! 💜
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
