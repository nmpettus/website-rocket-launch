import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, Play, Pause, Square, Lock } from "lucide-react";

interface Book { id: string; slug: string; title: string; page_count: number; is_free: boolean; }
interface Page { id: string; page_number: number; image_url: string; narration_text: string | null; }

export default function BookReader() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data: b } = await supabase.from("books").select("*").eq("slug", slug).maybeSingle();
      if (!b) { setLoading(false); return; }
      setBook(b as Book);
      const { data: p } = await supabase.from("book_pages").select("*").eq("book_id", b.id).order("page_number");
      setPages((p || []) as Page[]);
      setLoading(false);
    })();
    return () => { window.speechSynthesis.cancel(); };
  }, [slug]);

  const stopSpeech = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  const speakCurrent = () => {
    const page = pages[current];
    if (!page?.narration_text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(page.narration_text);
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const goPage = (n: number) => {
    stopSpeech();
    setCurrent(Math.max(0, Math.min(pages.length - 1, n)));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p>Book not found.</p>
      <Link to="/members"><Button variant="outline">Back to Library</Button></Link>
    </div>
  );

  const page = pages[current];
  const isPreviewPage = !!page && page.page_number <= 3;
  const needsPaywall = !isActive && !book.is_free && !!page && page.page_number > 3;
  // If page beyond preview & user not subscribed, RLS returns no row.
  // We can detect this: pages array may be shorter than book.page_count.
  const visiblePages = pages.length;
  const showPaywallNext = !isActive && !book.is_free && current === visiblePages - 1 && visiblePages < book.page_count;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/members" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Library
        </Link>
        <div className="text-sm text-white/70">
          {book.title} — Page {page?.page_number ?? 0} of {book.page_count}
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="w-full max-w-3xl">
          {page && (
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-muted">
                <img src={page.image_url} alt={`Page ${page.page_number}`} className="w-full h-full object-contain" />
              </div>
              {page.narration_text && (
                <div className="p-6 text-foreground text-lg leading-relaxed">
                  {page.narration_text}
                </div>
              )}
            </div>
          )}

          {showPaywallNext && (
            <div className="mt-4 bg-primary text-primary-foreground rounded-xl p-6 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-1">Keep reading with Maggie's Reading Club</h3>
              <p className="text-sm opacity-90 mb-4">Start your 7-day free trial to unlock the full story and the entire library.</p>
              <Button variant="secondary" onClick={() => navigate(user ? "/join" : "/auth")}>
                {user ? "Start Free Trial" : "Sign In to Subscribe"}
              </Button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <Button variant="secondary" disabled={current === 0} onClick={() => goPage(current - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              {!speaking ? (
                <Button onClick={speakCurrent} disabled={!page?.narration_text}>
                  <Play className="w-4 h-4 mr-1" /> Read Aloud
                </Button>
              ) : (
                <Button onClick={stopSpeech} variant="destructive">
                  <Square className="w-4 h-4 mr-1" /> Stop
                </Button>
              )}
            </div>

            <Button variant="secondary" disabled={current >= visiblePages - 1} onClick={() => goPage(current + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
