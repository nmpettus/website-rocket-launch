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
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [spread, setSpread] = useState(false);
  const [fit, setFit] = useState<"contain" | "cover">("contain");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data: b } = await supabase.from("books").select("*").eq("slug", slug).maybeSingle();
      if (!b) { setLoading(false); return; }
      setBook(b as Book);
      const { data: p } = await supabase.from("book_pages").select("*").eq("book_id", b.id).order("page_number");
      const rows = (p || []) as Page[];
      const resolved = await Promise.all(rows.map(async (row) => {
        if (!row.image_url || row.image_url.startsWith("http") || row.image_url.startsWith("/")) return row;
        const { data: signed } = await supabase.storage.from("book-pages").createSignedUrl(row.image_url, 3600);
        return { ...row, image_url: signed?.signedUrl ?? row.image_url };
      }));
      setPages(resolved);
      setLoading(false);
    })();
    return () => { stopSpeech(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const stopSpeech = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setSpeaking(false);
  };

  const speakCurrent = async () => {
    const page = pages[current];
    if (!page?.narration_text) return;
    stopSpeech();
    try {
      setLoadingAudio(true);
      const cacheKey = `${page.id}`;
      let url = audioCacheRef.current.get(cacheKey);
      if (!url) {
        const { data, error } = await supabase.functions.invoke("azure-tts", {
          body: { text: page.narration_text, voice: "en-US-SaraNeural" },
        });
        if (error) throw error;
        const blob = data as Blob;
        url = URL.createObjectURL(blob);
        audioCacheRef.current.set(cacheKey, url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
      setSpeaking(true);
    } catch (e) {
      console.error("TTS error", e);
      setSpeaking(false);
    } finally {
      setLoadingAudio(false);
    }
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
  const isPreviewPage = !!page && page.page_number >= 4 && page.page_number <= 6;
  const needsPaywall = !isActive && !book.is_free && !!page && (page.page_number < 4 || page.page_number > 6);
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

      <div className="flex-1 flex items-center justify-center px-2 pb-4">
        <div className={`w-full ${spread ? "max-w-[1600px]" : "max-w-5xl"} flex flex-col h-full`}>
          {page && (
            <div
              className={
                spread
                  ? "mx-auto flex h-[75vh] max-w-full overflow-hidden rounded-none bg-transparent shadow-2xl"
                  : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
              }
            >
              <div className={spread ? "flex h-full shrink-0" : "flex min-h-0 flex-1"}>
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  className={
                    spread
                      ? `block h-full w-auto max-w-[50vw] ${fit === "cover" ? "object-cover" : "object-contain"}`
                      : `h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`
                  }
                  style={spread ? undefined : { maxHeight: "75vh" }}
                />
              </div>
              {spread && pages[current + 1] && (
                <div className="flex h-full shrink-0">
                  <img
                    src={pages[current + 1].image_url}
                    alt={`Page ${pages[current + 1].page_number}`}
                    className={`block h-full w-auto max-w-[50vw] ${fit === "cover" ? "object-cover" : "object-contain"}`}
                  />
                </div>
              )}
              {!spread && page.narration_text && (
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
            <Button variant="secondary" disabled={current === 0} onClick={() => goPage(current - (spread ? 2 : 1))}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {!speaking ? (
                <Button onClick={speakCurrent} disabled={!page?.narration_text || loadingAudio}>
                  <Play className="w-4 h-4 mr-1" /> {loadingAudio ? "Loading..." : "Read Aloud"}
                </Button>
              ) : (
                <Button onClick={stopSpeech} variant="destructive">
                  <Square className="w-4 h-4 mr-1" /> Stop
                </Button>
              )}
              <Button variant="outline" onClick={() => setSpread((s) => !s)} className="text-foreground">
                {spread ? "Single Page" : "Two-Page Spread"}
              </Button>
              <Button variant="outline" onClick={() => setFit((f) => (f === "contain" ? "cover" : "contain"))} className="text-foreground">
                {fit === "contain" ? "Fill Page" : "Fit Page"}
              </Button>
            </div>

            <Button variant="secondary" disabled={current >= visiblePages - 1} onClick={() => goPage(current + (spread ? 2 : 1))}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
