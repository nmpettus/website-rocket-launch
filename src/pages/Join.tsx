import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, BookOpen, Volume2, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export default function Join() {
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const { openCheckout, checkoutElement, isOpen, closeCheckout } = useStripeCheckout();

  const handleJoin = (priceId: "reading_club_monthly" | "reading_club_yearly") => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isActive) {
      navigate("/members");
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email,
      userId: user.id,
      returnUrl: `${window.location.origin}/#/members?checkout=success`,
    });
  };

  const features = [
    { icon: BookOpen, title: "Maggie's full book library", desc: "Read every Maggie story online, anytime." },
    { icon: Volume2, title: "Read-aloud narration", desc: "Built-in voice narration for early readers." },
    { icon: Sparkles, title: "New books every month", desc: "Fresh stories added to the library regularly." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <PaymentTestModeBanner />
      <div className="container mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {isOpen ? (
          <div className="bg-card border rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Complete your subscription</h2>
              <Button variant="outline" onClick={closeCheckout}>Cancel</Button>
            </div>
            {checkoutElement}
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">7-Day Free Trial</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Maggie's Reading Club</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlimited online access to Maggie's full library — with read-aloud narration so kids can listen along.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((f) => (
                <div key={f.title} className="bg-card border rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-card border-2 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-1">Monthly</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> 7-day free trial</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Cancel anytime</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Full library access</li>
                </ul>
                <Button onClick={() => handleJoin("reading_club_monthly")} className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </div>

              <div className="bg-card border-2 border-primary rounded-2xl p-8 relative">
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Save 18%
                </div>
                <h3 className="text-xl font-bold mb-1">Yearly</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> 7-day free trial</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Two months free</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5" /> Full library access</li>
                </ul>
                <Button onClick={() => handleJoin("reading_club_yearly")} className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              You won't be charged until your 7-day trial ends. Cancel anytime from your account page.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
