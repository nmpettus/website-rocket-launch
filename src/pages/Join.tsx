import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, BookOpen, Volume2, Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Info, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { AdminStripeModeToggle } from "@/components/AdminStripeModeToggle";

export default function Join() {
  const { user } = useAuth();
  const { subscription, isActive, loading: subLoading } = useSubscription();
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
    { icon: Volume2, title: "Read-aloud narration", desc: "Built-in voice narration so kids can listen along." },
    { icon: Coins, title: "Reading Credits included", desc: "Use credits to unlock books, downloads, and short stories." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <PaymentTestModeBanner />
      <AdminStripeModeToggle floating />
      <div className="container mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-base text-foreground font-semibold hover:text-foreground/80">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {!subLoading && !isOpen && (() => {
          const periodEnd = subscription?.current_period_end
            ? new Date(subscription.current_period_end).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
            : null;

          if (!user) {
            return (
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold">You're not signed in</p>
                  <p className="text-base text-foreground font-semibold mb-3">
                    Sign in or create a free account first — we'll bring you right back to start your trial.
                  </p>
                  <Button size="sm" onClick={() => navigate("/auth")}>Sign in to continue</Button>
                </div>
              </div>
            );
          }

          if (isActive && subscription?.status === "canceled" && periodEnd) {
            return (
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:bg-amber-950/30">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold">Your subscription is canceled but still active</p>
                  <p className="text-base text-foreground font-semibold mb-3">
                    You have library access until <span className="font-medium">{periodEnd}</span>. Resubscribe anytime from the Members page.
                  </p>
                  <Button size="sm" onClick={() => navigate("/members")}>Go to library</Button>
                </div>
              </div>
            );
          }

          if (isActive) {
            return (
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:bg-emerald-950/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold">
                    You're already subscribed{subscription?.status === "trialing" ? " (free trial active)" : ""}
                  </p>
                  <p className="text-base text-foreground font-semibold mb-3">
                    No need to sign up again.{periodEnd ? ` Your plan renews on ${periodEnd}.` : ""} Head to the library to start reading, or manage billing from the Members page.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => navigate("/members")}>Go to library</Button>
                    <Button size="sm" variant="outline" onClick={() => navigate("/members")}>Manage subscription</Button>
                  </div>
                </div>
              </div>
            );
          }

          if (subscription && ["canceled", "incomplete_expired", "unpaid"].includes(subscription.status)) {
            return (
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <Info className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold">Welcome back!</p>
                  <p className="text-base text-foreground font-semibold">
                    Your previous subscription ended. Pick a plan below to start reading again.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-base font-semibold">Ready when you are</p>
                <p className="text-base text-foreground font-semibold">
                  You don't have an active subscription yet. Start your 7-day free trial below — cancel anytime.
                </p>
              </div>
            </div>
          );
        })()}

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
              <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-3 rounded-full mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xl font-extrabold text-primary">7-Day Free Trial</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Maggie's Reading Club</h1>
              <p className="text-xl text-foreground font-semibold max-w-2xl mx-auto">
                Unlimited online access to Maggie's full library — with read-aloud narration so kids can listen along.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((f) => (
                <div key={f.title} className="bg-card border rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                  <p className="text-base text-foreground font-semibold">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-card border-2 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-1">Monthly</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold">$4.99</span>
                  <span className="text-lg text-foreground font-semibold">/month</span>
                </div>
                <div className="bg-primary/10 rounded-xl p-4 mb-5">
                  <p className="text-base font-bold text-primary mb-1">7 credits every month</p>
                  <p className="text-base text-foreground font-semibold">Use them to unlock books, downloads, and short stories.</p>
                </div>
                <ul className="space-y-2 mb-6 text-base text-foreground font-semibold">
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> 7-day free trial</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Cancel anytime</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Keep access to every book you've unlocked</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Read-aloud narration included</li>
                </ul>

                <Button onClick={() => handleJoin("reading_club_monthly")} className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </div>

              <div className="bg-card border-2 border-primary rounded-2xl p-8 relative">
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full font-medium">
                  Save 18%
                </div>
                <h3 className="text-2xl font-bold mb-1">Yearly</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-lg text-foreground font-semibold">/year</span>
                </div>
                <div className="bg-primary/10 rounded-xl p-4 mb-5">
                  <p className="text-base font-bold text-primary mb-1">12 credits every month</p>
                  <p className="text-base text-foreground font-semibold">10 monthly credits + 2 bonus credits. Use them to unlock books, downloads, and short stories.</p>
                </div>
                <ul className="space-y-2 mb-6 text-base text-foreground font-semibold">
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> 7-day free trial</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Two months free</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Keep access to every book you've unlocked</li>
                  <li className="flex gap-2"><Check className="w-5 h-5 text-primary mt-0.5" /> Read-aloud narration included</li>
                </ul>

                <Button onClick={() => handleJoin("reading_club_yearly")} className="w-full" size="lg">
                  Start Free Trial
                </Button>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-card border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center">How credits work</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary mb-1">3 credits</p>
                  <p className="text-base text-foreground font-semibold">Picture books</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary mb-1">2 credits</p>
                  <p className="text-base text-foreground font-semibold">Coloring books, devotionals & downloads</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary mb-1">1 credit</p>
                  <p className="text-base text-foreground font-semibold">Short stories</p>
                </div>
              </div>
              <p className="text-center text-base text-foreground font-semibold mt-4">
                Credits refresh each month and do not roll over. Once you unlock a book, it stays unlocked for as long as you are subscribed.
              </p>
            </div>

            <p className="text-center text-sm text-foreground font-semibold mt-8">
              You won't be charged until your 7-day trial ends. Cancel anytime from your account page.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
