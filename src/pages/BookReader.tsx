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
  const [layoutMode, setLayoutMode] = useState<"auto" | "single" | "spread">("auto");
  const [fit, setFit] = useState<"contain" | "cover">("contain");
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [pairs, setPairs] = useState<Record<string, boolean>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, (string | null)[]>>(new Map());
  const inflightAudioRef = useRef<Map<string, Promise<string | null>[]>>(new Map());

  // Per-page edge samples — sampled once, reused for every adjacency check.
  type EdgeSample = { rows: Array<{ r: number; g: number; b: number }>; brightness: number; saturation: number; variance: number };
  const edgeCacheRef = useRef<Map<string, { left: EdgeSample; right: EdgeSample; aspect: number }>>(new Map());
  const samplingRef = useRef<Map<string, Promise<void>>>(new Map());


  const isPortrait = (id?: string) => {
    if (!id) return false;
    const a = aspects[id];
    return a !== undefined && a < 1.2;
  };
  const isWide = (id?: string) => {
    if (!id) return false;
    const a = aspects[id];
    return a !== undefined && a >= 1.4;
  };
  const recordAspect = (id: string, w: number, h: number) => {
    if (!h) return;
    setAspects((prev) => (prev[id] ? prev : { ...prev, [id]: w / h }));
  };

  // Sample both edges of one page exactly once, cache the result.
  const samplePage = (pageId: string, url: string): Promise<void> => {
    if (edgeCacheRef.current.has(pageId)) return Promise.resolve();
    const existing = samplingRef.current.get(pageId);
    if (existing) return existing;
    const p = (async () => {
      try {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = url;
        });
        const sampleEdge = (side: "left" | "right"): EdgeSample | null => {
          const h = 96, w = 12;
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const ctx = c.getContext("2d");
          if (!ctx) return null;
          const stripW = Math.max(2, Math.floor(img.naturalWidth * 0.04));
          const sx = side === "right" ? img.naturalWidth - stripW : 0;
          ctx.drawImage(img, sx, 0, stripW, img.naturalHeight, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;
          const rows: Array<{ r: number; g: number; b: number }> = [];
          let rr = 0, gg = 0, bb = 0;
          for (let y = 0; y < h; y++) {
            let rR = 0, rG = 0, rB = 0;
            for (let x = 0; x < w; x++) {
              const i = (y * w + x) * 4;
              rR += data[i]; rG += data[i + 1]; rB += data[i + 2];
            }
            rR /= w; rG /= w; rB /= w;
            rows.push({ r: rR, g: rG, b: rB });
            rr += rR; gg += rG; bb += rB;
          }
          const avg = { r: rr / h, g: gg / h, b: bb / h };
          const brightness = (avg.r + avg.g + avg.b) / 3;
          const saturation = Math.max(avg.r, avg.g, avg.b) - Math.min(avg.r, avg.g, avg.b);
          let variance = 0;
          for (const row of rows) variance += Math.abs(row.r - avg.r) + Math.abs(row.g - avg.g) + Math.abs(row.b - avg.b);
          variance /= rows.length;
          return { rows, brightness, saturation, variance };
        };
        const left = sampleEdge("left");
        const right = sampleEdge("right");
        if (!left || !right) return;
        const aspect = img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        edgeCacheRef.current.set(pageId, { left, right, aspect });
        setAspects((prev) => (prev[pageId] !== undefined ? prev : { ...prev, [pageId]: aspect }));
      } catch {
        // ignore
      } finally {
        samplingRef.current.delete(pageId);
      }
    })();
    samplingRef.current.set(pageId, p);
    return p;
  };

  const computePairFromCache = (leftId: string, rightId: string, key: string) => {
    if (pairs[key] !== undefined) return;
    const a = edgeCacheRef.current.get(leftId);
    const b = edgeCacheRef.current.get(rightId);
    if (!a || !b) return;
    const MAX_DIST = Math.sqrt(255 * 255 * 3);
    const ar = a.right.rows, br = b.left.rows;
    let sum = 0;
    for (let i = 0; i < ar.length; i++) {
      const ra = ar[i], rb = br[i];
      const d = Math.sqrt((ra.r - rb.r) ** 2 + (ra.g - rb.g) ** 2 + (ra.b - rb.b) ** 2);
      sum += 1 - d / MAX_DIST;
    }
    const matchPercent = sum / ar.length;
    const blankLeft = a.right.brightness > 240 && a.right.saturation < 14 && a.right.variance < 8;
    const blankRight = b.left.brightness > 240 && b.left.saturation < 14 && b.left.variance < 8;
    const isNaturalSpread = matchPercent > 0.5 && !(blankLeft && blankRight);
    setPairs((prev) => ({ ...prev, [key]: isNaturalSpread }));
  };

  const detectPair = async (leftUrl: string, rightUrl: string, key: string) => {
    if (pairs[key] !== undefined) return;
    const [leftId, rightId] = key.split("|");
    const lp = pages.find((p) => p.id === leftId);
    const rp = pages.find((p) => p.id === rightId);
    if (!lp || !rp) return;
    await Promise.all([samplePage(leftId, lp.image_url), samplePage(rightId, rp.image_url)]);
    computePairFromCache(leftId, rightId, key);
  };

  const pairKey = (a?: string, b?: string) => (a && b ? `${a}|${b}` : "");

  const canAutoPairAt = (index: number) => {
    const cur = pages[index];
    const nxt = pages[index + 1];
    if (!cur || !nxt) return false;
    if (isWide(cur.id) || isWide(nxt.id)) return false;
    return pairs[pairKey(cur.id, nxt.id)] === true;
  };

  const autoSpread = canAutoPairAt(current);

  const page = pages[current];
  const currentIsWide = isWide(page?.id);
  const manualSpread = layoutMode === "spread" && !!pages[current + 1] && !currentIsWide;
  const spread = manualSpread || (layoutMode === "auto" && autoSpread);
  const pairedSpread = spread && !!pages[current + 1] && !currentIsWide;
  const displayAsSpread = pairedSpread || currentIsWide;

  // Pre-sample ALL pages and compute ALL adjacent pairs in the background as
  // soon as pages load. After that every navigation is instant from cache.
  useEffect(() => {
    if (pages.length === 0) return;
    let cancelled = false;
    (async () => {
      // Prioritize nearby pages first.
      const order = [...pages.keys()].sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
      for (const i of order) {
        if (cancelled) return;
        await samplePage(pages[i].id, pages[i].image_url);
        // Compute any newly-possible pairs touching this index.
        for (const j of [i - 1, i]) {
          const a = pages[j], b = pages[j + 1];
          if (a && b) computePairFromCache(a.id, b.id, pairKey(a.id, b.id));
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);




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
    try { window.speechSynthesis?.cancel(); } catch {}
    setSpeaking(false);
  };

  const speakWithBrowser = (text: string) => {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      setSpeaking(true);
    } catch (e) {
      console.error("Browser TTS error", e);
      setSpeaking(false);
    }
  };

  const extractTextForPage = async (page: Page): Promise<string> => {
    let text = page.narration_text?.trim() || "";
    if (!text) {
      const { data: ocr, error: ocrErr } = await supabase.functions.invoke("ocr-page", {
        body: { imageUrl: page.image_url },
      });
      if (ocrErr) console.warn("OCR error", ocrErr);
      text = (ocr?.text ?? "").toString().trim();
      if (text) {
        await supabase.from("book_pages").update({ narration_text: text }).eq("id", page.id);
        setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, narration_text: text } : p)));
      }
    }
    return text;
  };

  const fetchAudioUrl = async (cacheKey: string, text: string): Promise<string | null> => {
    const cached = audioCacheRef.current.get(cacheKey);
    if (cached) return cached;
    try {
      const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
      const ANON = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/azure-tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({ text, voice: "en-US-SaraNeural" }),
      });
      const ct = resp.headers.get("Content-Type") || "";
      if (!resp.ok || ct.includes("application/json")) return null;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      audioCacheRef.current.set(cacheKey, url);
      return url;
    } catch {
      return null;
    }
  };

  const buildSpeech = async (): Promise<{ cacheKey: string; text: string } | null> => {
    const page = pages[current];
    if (!page) return null;
    const leftText = await extractTextForPage(page);
    let combined = leftText;
    let cacheKey = page.id;
    if (spread && pages[current + 1]) {
      const rightText = await extractTextForPage(pages[current + 1]);
      if (rightText) combined = leftText ? `${leftText}\n\n${rightText}` : rightText;
      cacheKey = `${page.id}+${pages[current + 1].id}`;
    }
    if (!combined) return null;
    return { cacheKey, text: combined };
  };

  // Prefetch audio for current page as soon as it changes so playback starts instantly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!pages[current]) return;
      const built = await buildSpeech();
      if (cancelled || !built) return;
      if (!audioCacheRef.current.has(built.cacheKey)) {
        fetchAudioUrl(built.cacheKey, built.text);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, spread, pages]);

  const speakCurrent = async () => {
    const page = pages[current];
    if (!page) return;
    stopSpeech();
    setLoadingAudio(true);
    let text = "";
    try {
      const built = await buildSpeech();
      if (!built) {
        speakWithBrowser("No narration text could be found on this page.");
        return;
      }
      text = built.text;
      const url = await fetchAudioUrl(built.cacheKey, built.text);
      if (!url) {
        speakWithBrowser(text);
        return;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => {
        console.warn("Audio playback failed, using browser fallback");
        speakWithBrowser(text);
      };
      await audio.play();
      setSpeaking(true);
    } catch (e) {
      console.error("TTS error, falling back to browser", e);
      if (text) speakWithBrowser(text);
    } finally {
      setLoadingAudio(false);
    }
  };



  const goPage = (n: number) => {
    stopSpeech();
    setCurrent(Math.max(0, Math.min(pages.length - 1, n)));
  };

  const previousPageIndex = () => {
    if (layoutMode === "auto") {
      if (current > 0 && canAutoPairAt(current - 1)) return current - 1;
      if (current > 1 && canAutoPairAt(current - 2)) return current - 2;
      return current - 1;
    }
    return current - (pairedSpread ? 2 : 1);
  };

  const nextPageIndex = () => current + (pairedSpread ? 2 : 1);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p>Book not found.</p>
      <Link to="/members"><Button variant="outline">Back to Library</Button></Link>
    </div>
  );

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
        <div className={`w-full ${displayAsSpread ? "max-w-[95vw]" : "max-w-5xl"} flex flex-col`}>
          {page && (
            <div
              className={
                displayAsSpread
                  ? `mx-auto flex max-w-full overflow-hidden rounded-none bg-transparent shadow-2xl ${fit === "cover" ? "max-h-[85vh]" : "max-h-[70vh]"}`
                  : "flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-white shadow-2xl"
              }
            >
              <div className={displayAsSpread ? "flex shrink-0" : "flex min-h-0 flex-1 items-center justify-center"}>
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  onLoad={(e) => recordAspect(page.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                  className={`block w-auto max-w-full object-contain ${fit === "cover" ? "max-h-[85vh]" : "max-h-[70vh]"}`}
                />
              </div>
              {pairedSpread && pages[current + 1] && (
                <div className="flex shrink-0">
                  <img
                    src={pages[current + 1].image_url}
                    alt={`Page ${pages[current + 1].page_number}`}
                    onLoad={(e) => recordAspect(pages[current + 1].id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                    className={`block w-auto max-w-[50vw] object-contain ${fit === "cover" ? "max-h-[85vh]" : "max-h-[70vh]"}`}
                  />
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
            <Button variant="secondary" disabled={current === 0} onClick={() => goPage(previousPageIndex())}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {!speaking ? (
                <Button onClick={speakCurrent} disabled={loadingAudio}>
                  <Play className="w-4 h-4 mr-1" /> {loadingAudio ? "Loading..." : "Read Aloud"}
                </Button>
              ) : (
                <Button onClick={stopSpeech} variant="destructive">
                  <Square className="w-4 h-4 mr-1" /> Stop
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setLayoutMode((m) => (m === "auto" ? "single" : m === "single" ? "spread" : "auto"))}
                className="text-foreground"
                title="Layout: Auto detects spreads from page shape"
              >
                {layoutMode === "auto" ? `Auto (${displayAsSpread ? "Spread" : "Single"})` : layoutMode === "spread" ? "Two-Page Spread" : "Single Page"}
              </Button>
              <Button variant="outline" onClick={() => setFit((f) => (f === "contain" ? "cover" : "contain"))} className="text-foreground">
                {fit === "contain" ? "Fill Page" : "Fit Page"}
              </Button>
            </div>

            <Button variant="secondary" disabled={current >= visiblePages - 1} onClick={() => goPage(nextPageIndex())}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
