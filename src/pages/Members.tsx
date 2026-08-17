import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lock, ArrowLeft, Settings, LogOut, XCircle, CreditCard, Calendar, BadgeCheck, ShoppingCart, Coins, Download } from "lucide-react";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { AdminStripeModeToggle } from "@/components/AdminStripeModeToggle";

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
  content_type?: string | null;
  credit_cost?: number | null;
  download_path?: string | null;

}

export default function Members() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isActive, subscription, refetch } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [refundInfo, setRefundInfo] = useState<{ amount_cents: number; months_remaining: number } | null>(null);
  const [requestingRefund, setRequestingRefund] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [pendingUnlock, setPendingUnlock] = useState<Book | null>(null);
  const [downloadBusyId, setDownloadBusyId] = useState<string | null>(null);

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
    const CACHE_KEY = "members:covers:v1";
    (async () => {
      // Warm from cache instantly so covers paint on first frame.
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.expires > Date.now() && Array.isArray(parsed.books)) {
            setBooks(parsed.books as Book[]);
            setLoading(false);
          }
        }
      } catch { /* ignore cache errors */ }

      const { data } = await supabase.from("books").select("*").order("sort_order");
      const rows = (data || []) as Book[];

      // Sign all storage covers in ONE request instead of N sequential ones.
      const needSigning = rows.filter(
        (b) => b.cover_image_url && !b.cover_image_url.startsWith("http") && !b.cover_image_url.startsWith("/")
      );
      const signedMap = new Map<string, string>();
      if (needSigning.length) {
        const { data: signed } = await supabase.storage
          .from("book-pages")
          .createSignedUrls(needSigning.map((b) => b.cover_image_url as string), 3600);
        signed?.forEach((s) => {
          if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
        });
      }
      const resolved = rows.map((b) =>
        b.cover_image_url && signedMap.has(b.cover_image_url)
          ? { ...b, cover_image_url: signedMap.get(b.cover_image_url)! }
          : b
      );
      setBooks(resolved);
      setLoading(false);
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ expires: Date.now() + 45 * 60 * 1000, books: resolved })
        );
      } catch { /* quota - ignore */ }

      // Decode covers off the main thread so scrolling stays smooth.
      resolved.forEach((b) => {
        if (b.cover_image_url) {
          const img = new Image();
          img.decoding = "async";
          img.src = b.cover_image_url;
        }
      });
    })();
  }, []);


  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const fetchCreditBalance = async () => {
    if (!user) return;
    const { getStripeEnvironment } = await import("@/lib/stripe");
    const env = getStripeEnvironment();
    const { data, error } = await supabase.rpc("ensure_and_get_credit_balance", {
      _user_id: user.id,
      _environment: env,
    });
    if (!error) setCreditBalance(data ?? 0);
  };

  const fetchRefundInfo = async () => {
    if (!user || !subscription || subscription.price_id !== "reading_club_yearly") {
      setRefundInfo(null);
      return;
    }
    const { getStripeEnvironment } = await import("@/lib/stripe");
    const { data, error } = await supabase.rpc("get_refundable_amount", {
      _user_id: user.id,
      _environment: getStripeEnvironment(),
    });
    if (error || !data) {
      setRefundInfo(null);
      return;
    }
    const info = data as { amount_cents: number; months_remaining: number };
    setRefundInfo(info.months_remaining > 0 ? info : null);
  };

  const fetchUnlocks = async () => {
    if (!user) return;
    const { data } = await supabase.from("unlocks").select("book_id").eq("user_id", user.id);
    setUnlockedIds(new Set((data || []).map((u: { book_id: string }) => u.book_id)));
  };

  const startDownload = async (book: Book) => {
    setDownloadBusyId(book.id);
    try {
      const { data, error } = await supabase.functions.invoke("get-download-url", {
        body: { bookId: book.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      window.open(data.url as string, "_blank", "noopener");
    } catch (e: any) {
      toast.error(e.message || "Could not start the download");
    } finally {
      setDownloadBusyId(null);
    }
  };

  const confirmUnlockDownload = async () => {
    const book = pendingUnlock;
    if (!book) return;
    setDownloadBusyId(book.id);
    try {
      const { data, error } = await supabase.rpc("spend_credits", { _book_id: book.id });
      if (error) throw error;
      const result = data as { success: boolean; error?: string; balance?: number };
      if (!result?.success) throw new Error(result?.error || "Could not unlock this item");
      setUnlockedIds((prev) => new Set(prev).add(book.id));
      await fetchCreditBalance();
      setPendingUnlock(null);
      toast.success(`Unlocked "${book.title}" — it's yours to keep.`);
      await startDownload(book);
    } catch (e: any) {
      toast.error(e.message || "Could not unlock this item");
    } finally {
      setDownloadBusyId(null);
    }
  };

  useEffect(() => {
    fetchCreditBalance();
    fetchRefundInfo();
    fetchUnlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, subscription?.id]);


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

  const requestRefund = async () => {
    if (!user || !subscription || !refundInfo) return;
    setRequestingRefund(true);
    try {
      const { getStripeEnvironment } = await import("@/lib/stripe");
      const { data, error } = await supabase.functions.invoke("process-refund", {
        body: {
          environment: getStripeEnvironment(),
          subscriptionId: subscription.id,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Refund of $${(data.refunded_cents / 100).toFixed(2)} has been processed.`);
      await refetch();
      await fetchRefundInfo();
    } catch (e: any) {
      toast.error(e.message || "Could not process refund");
    } finally {
      setRequestingRefund(false);
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
      <PaymentTestModeBanner />
      <AdminStripeModeToggle floating />
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
              {isActive && creditBalance !== null && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Coins className="w-4 h-4 mr-1 text-primary" />
                    {creditBalance} reading credit{creditBalance === 1 ? "" : "s"} this month
                  </Badge>
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
                {books.map((book, bookIndex) => {
                  const locked = !isActive && !book.is_free;
                  const amazonUrl = AMAZON_PAPERBACK_LINKS[book.slug];
                  const isDownload = !!book.download_path;
                  const cost = book.is_free ? 0 : book.credit_cost ?? 3;
                  const unlocked = unlockedIds.has(book.id);

                  const cardBody = (
                    <>
                      <div className="aspect-square bg-muted relative border border-black">
                        {book.cover_image_url && (
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            loading={bookIndex < 8 ? "eager" : "lazy"}
                            fetchPriority={bookIndex < 4 ? "high" : "auto"}
                            decoding="async"
                          />
                        )}

                        {(locked || (isDownload && !unlocked)) && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3">
                              <Lock className="w-6 h-6 text-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 rounded-full bg-background/95 border px-2.5 py-1 text-xs font-bold shadow-sm">
                          {cost === 0 ? "Free" : `${cost} credit${cost === 1 ? "" : "s"}`}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1 line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {isDownload ? "PDF download" : `${book.page_count} pages`}
                          {book.content_type ? ` • ${book.content_type.replace(/_/g, " ")}` : ""}
                          {" • "}
                          {book.is_free ? "Free" : `${cost} credit${cost === 1 ? "" : "s"}`}
                          {isDownload && unlocked && " • Unlocked"}
                          {!isDownload && locked && " • Preview only"}
                        </p>
                      </div>
                    </>
                  );

                  return (
                    <div
                      key={book.id}
                      className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
                    >
                      {isDownload ? (
                        <div className="block">{cardBody}</div>
                      ) : (
                        <Link to={`/read/${book.slug}`} className="block">{cardBody}</Link>
                      )}

                      {isDownload && (
                        <div className="px-4 pb-4 mt-auto">
                          <Button
                            size="sm"
                            className="w-full rounded-full font-medium"
                            disabled={downloadBusyId === book.id || (!unlocked && !isActive)}
                            onClick={() => (unlocked ? startDownload(book) : setPendingUnlock(book))}
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            {downloadBusyId === book.id
                              ? "Working…"
                              : unlocked
                                ? "Download PDF"
                                : !isActive
                                  ? "Members only"
                                  : `Unlock & Download (${cost} credit${cost === 1 ? "" : "s"})`}
                          </Button>
                        </div>
                      )}

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
              <>
                {refundInfo && (
                  <div className="mt-6 rounded-xl border bg-card p-5">
                    <h3 className="font-semibold text-lg mb-2">Yearly refund available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You have {refundInfo.months_remaining} whole month{refundInfo.months_remaining === 1 ? "" : "s"} left on your yearly plan.
                      Canceling now will end your subscription at the close of this billing period and refund
                      <strong> ${(refundInfo.amount_cents / 100).toFixed(2)}</strong> for the remaining months.
                      Any unused credits will be lost.
                    </p>
                    <Button
                      variant="outline"
                      disabled={requestingRefund}
                      onClick={requestRefund}
                      className="text-destructive hover:text-destructive"
                    >
                      {requestingRefund ? "Processing…" : "Cancel & Refund Remaining Months"}
                    </Button>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={openPortal}>
                    <Settings className="w-4 h-4 mr-2" /> Manage Subscription
                  </Button>
                  {showCancelButton && !refundInfo && (
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
                            . After that your subscription will end and you won't be charged again. Any unused credits will be lost. You can resubscribe anytime.
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
              </>
            )}
            {!isActive && (
              <div className="mt-6">
                <Button onClick={() => navigate("/join")}>Start Free Trial</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!pendingUnlock} onOpenChange={(open) => !open && setPendingUnlock(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock "{pendingUnlock?.title}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will use {pendingUnlock?.credit_cost ?? 2} credit
                {(pendingUnlock?.credit_cost ?? 2) === 1 ? "" : "s"}
                {creditBalance !== null
                  ? ` — you'll have ${Math.max(0, creditBalance - (pendingUnlock?.credit_cost ?? 2))} left this month.`
                  : "."}{" "}
                Once unlocked, the PDF is yours to download and keep forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not now</AlertDialogCancel>
              <AlertDialogAction onClick={confirmUnlockDownload} disabled={!!downloadBusyId}>
                {downloadBusyId ? "Unlocking…" : "Unlock & Download"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  );
}
