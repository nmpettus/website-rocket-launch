import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, ArrowLeft, Settings, LogOut, XCircle, CreditCard, Calendar, BadgeCheck, ShoppingCart } from "lucide-react";

// Amazon paperback links for library books (keyed by Supabase book slug)
const AMAZON_PAPERBACK_LINKS: Record<string, string> = {
  c: "https://a.co/d/8DoEE31",
  n: "https://a.co/d/5czEdgO",
  t: "https://a.co/d/7Eqcogw",
  j: "https://a.co/d/1NfnyaE",
  g: "https://a.co/d/a1KplpW",
  i: "https://www.amazon.com/Independence-Day-told-Maggie-Matteo/dp/B0H3L5NVL7",
  "maggie-s-ai-adventure-a-guide-to-pixels-patterns-and-how-computers-learn-book-1-ai-basics": "https://a.co/d/03abDACO",
  "christmas-as-told-by-maggie-discovering-the-christmas-story-through-god-s-promises-maggie-s-story-library": "https://a.co/d/6Xkd4Ut",
  "maggie-s-ai-adventures-book-2-8-75-x-8-75-in": "https://a.co/d/058bbbN3",
};
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Book {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  page_count: number;
  is_free: boolean;
}

export default function Members() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isActive, subscription, refetch } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const checkoutHandledRef = useRef(false);

  useEffect(() => {
    if (checkoutHandledRef.current) return;
    if (searchParams.get("checkout") !== "success") return;
    checkoutHandledRef.current = true;
    toast.success("Subscription activated! Loading your library...");
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refetch();
      if (attempts >= 10) clearInterval(interval);
    }, 1500);
    // Strip the query param so a manual refresh doesn't retrigger.
    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    next.delete("session_id");
    setSearchParams(next, { replace: true });
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("books").select("*").order("sort_order");
      const rows = (data || []) as Book[];
      const resolved = await Promise.all(rows.map(async (b) => {
        if (!b.cover_image_url || b.cover_image_url.startsWith("http") || b.cover_image_url.startsWith("/")) return b;
        const { data: signed } = await supabase.storage.from("book-pages").createSignedUrl(b.cover_image_url, 3600);
        return { ...b, cover_image_url: signed?.signedUrl ?? b.cover_image_url };
      }));
      setBooks(resolved);
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const openPortal = async () => {
    try {
      const { getStripeEnvironment } = await import("@/lib/stripe");
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: { returnUrl: `${window.location.origin}/#/members`, environment: getStripeEnvironment() },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Could not open billing portal");
    }
  };

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const { getStripeEnvironment } = await import("@/lib/stripe");
      const { data, error } = await supabase.functions.invoke("cancel-subscription", {
        body: { environment: getStripeEnvironment(), immediate: false },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Subscription canceled. You'll keep access until the end of your billing period.");
      await refetch();
    } catch (e: any) {
      toast.error(e.message || "Could not cancel subscription");
    } finally {
      setCanceling(false);
    }
  };

  if (authLoading || !user) return null;

  const showCancelButton = isActive && !subscription?.cancel_at_period_end;

  const statusPanel = subscription ? (
    <div className="mt-4 bg-card border rounded-xl p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Subscription Status</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Plan</p>
            <p className="font-medium text-sm">{subscription.price_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
            <p className="font-medium text-sm capitalize">{subscription.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {subscription.status === "trialing" ? "Trial Ends" : "Renews"}
            </p>
            <p className="font-medium text-sm">
              {subscription.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Tabs defaultValue="library">
          <TabsList className="mb-6">
            <TabsTrigger value="library">My Library</TabsTrigger>
            <TabsTrigger value="subscription">Manage Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Library</h1>
              <p className="text-muted-foreground">
                Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
              </p>
              {!isActive && (
                <div className="mt-4 bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold">You're not subscribed yet</p>
                    <p className="text-sm text-muted-foreground">Preview the first 3 pages of any book free. Subscribe to read everything.</p>
                  </div>
                  <Button onClick={() => navigate("/join")}>Start Free Trial</Button>
                </div>
              )}
              {isActive && subscription?.cancel_at_period_end && subscription.current_period_end && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-900">
                    Your subscription is set to cancel on {new Date(subscription.current_period_end).toLocaleDateString()}.
                  </p>
                </div>
              )}
              {isActive && subscription?.status === "trialing" && subscription.current_period_end && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-900">
                    Free trial active — first charge on {new Date(subscription.current_period_end).toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading library...</p>
            ) : books.length === 0 ? (
              <p className="text-muted-foreground">Books are being added soon!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => {
                  const locked = !isActive && !book.is_free;
                  const amazonUrl = AMAZON_PAPERBACK_LINKS[book.slug];
                  return (
                    <div
                      key={book.id}
                      className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
                    >
                      <Link to={`/read/${book.slug}`} className="block">
                        <div className="aspect-square bg-muted relative border border-black">
                          {book.cover_image_url && (
                            <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                          )}
                          {locked && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3">
                                <Lock className="w-6 h-6 text-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-1 line-clamp-1">{book.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {book.page_count} pages {locked && "• Preview only"}
                          </p>
                        </div>
                      </Link>
                      {amazonUrl && (
                        <div className="px-4 pb-4 mt-auto">
                          <Button
                            asChild
                            size="sm"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full"
                          >
                            <a
                              href={amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Buy ${book.title} paperback on Amazon`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                              Buy Paperback on Amazon
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Subscription</h1>
              <p className="text-muted-foreground">View and manage your subscription details.</p>
            </div>
            {statusPanel}
            {isActive && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={openPortal}>
                  <Settings className="w-4 h-4 mr-2" /> Manage Subscription
                </Button>
                {showCancelButton && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-destructive hover:text-destructive">
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll keep full access to the library until the end of your current billing period
                          {subscription?.current_period_end
                            ? ` (${new Date(subscription.current_period_end).toLocaleDateString()})`
                            : ""}
                          . After that your subscription will end and you won't be charged again. You can resubscribe anytime.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                        <AlertDialogAction onClick={cancelSubscription} disabled={canceling}>
                          {canceling ? "Canceling..." : "Yes, cancel"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
            {!isActive && (
              <div className="mt-6">
                <Button onClick={() => navigate("/join")}>Start Free Trial</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
