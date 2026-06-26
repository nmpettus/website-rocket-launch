import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, ArrowLeft, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

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
  const { isActive, subscription } = useSubscription();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          {isActive && (
            <Button variant="outline" size="sm" onClick={openPortal}>
              <Settings className="w-4 h-4 mr-2" /> Manage Subscription
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
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
              return (
                <Link
                  key={book.id}
                  to={`/read/${book.slug}`}
                  className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-muted relative">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
