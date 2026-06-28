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
  const audioCacheRef = useRef<Map<string, string>>(new Map());

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

  // Edge-similarity detection: load left & right images, sample inner edge strips,
  // and compare average color + variance. If the seam blends, they are a natural spread.
  const detectPair = async (leftUrl: string, rightUrl: string, key: string) => {
    if (pairs[key] !== undefined) return;
    try {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });
      const [l, r] = await Promise.all([load(leftUrl), load(rightUrl)]);
      const [leftId, rightId] = key.split("|");
      setAspects((prev) => {
        let changed = false;
        const next = { ...prev };
        if (leftId && next[leftId] === undefined && l.naturalHeight) {
          next[leftId] = l.naturalWidth / l.naturalHeight;
          changed = true;
        }
        if (rightId && next[rightId] === undefined && r.naturalHeight) {
          next[rightId] = r.naturalWidth / r.naturalHeight;
          changed = true;
        }
        return changed ? next : prev;
      });
      const sampleEdge = (img: HTMLImageElement, side: "left" | "right") => {
        const h = 96;
        const w = 12;
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return null;
        const sx = side === "right" ? img.naturalWidth - Math.max(2, Math.floor(img.naturalWidth * 0.03)) : 0;
        const sw = Math.max(2, Math.floor(img.naturalWidth * 0.03));
        ctx.drawImage(img, sx, 0, sw, img.naturalHeight, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let rr = 0, gg = 0, bb = 0, n = 0;
        const rows: Array<{ r: number; g: number; b: number }> = [];
        for (let y = 0; y < h; y++) {
          let rowR = 0, rowG = 0, rowB = 0;
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            rowR += data[i]; rowG += data[i + 1]; rowB += data[i + 2];
          }
          rows.push({ r: rowR / w, g: rowG / w, b: rowB / w });
          rr += rowR; gg += rowG; bb += rowB; n += w;
        }
        const avg = { r: rr / n, g: gg / n, b: bb / n };
        let variance = 0;
        for (let i = 0; i < data.length; i += 4) {
          variance += Math.abs(data[i] - avg.r) + Math.abs(data[i + 1] - avg.g) + Math.abs(data[i + 2] - avg.b);
        }
        const brightness = (avg.r + avg.g + avg.b) / 3;
        const saturation = Math.max(avg.r, avg.g, avg.b) - Math.min(avg.r, avg.g, avg.b);
        return { ...avg, rows, variance: variance / n / 3, brightness, saturation };
      };
      const a = sampleEdge(l, "right");
      const b = sampleEdge(r, "left");
      if (!a || !b) return;
      const averageDiff = Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
      const profileDiff = a.rows.reduce((total, row, i) => {
        const other = b.rows[i];
        return total + Math.sqrt((row.r - other.r) ** 2 + (row.g - other.g) ** 2 + (row.b - other.b) ** 2);
      }, 0) / a.rows.length;
      const blankLeft = a.brightness > 238 && a.saturation < 18 && a.variance < 12;
      const blankRight = b.brightness > 238 && b.saturation < 18 && b.variance < 12;
      // Avoid false spreads caused by matching white page margins. A natural
      // spread should have edge colors that match down the seam and at least
      // one edge should contain real artwork/detail instead of blank paper.
      const isNaturalSpread = averageDiff < 30 && profileDiff < 34 && !(blankLeft && blankRight);
      setPairs((prev) => ({ ...prev, [key]: isNaturalSpread }));
    } catch {
      // CORS or load failure — leave undefined; fall back to aspect heuristic.
    }
  };

  const pairKey = (a?: string, b?: string) => (a && b ? `${a}|${b}` : "");

  const canAutoPairAt = (index: number) => {
    const cur = pages[index];
    const nxt = pages[index + 1];
    if (!cur || !nxt) return false;
    if (isWide(cur.id) || isWide(nxt.id)) return false;
    if (!isPortrait(cur.id) || !isPortrait(nxt.id)) return false;
    return pairs[pairKey(cur.id, nxt.id)] === true;
  };

  const autoSpread = (() => {
    // Only allow a page to start one pair. If the previous page already pairs
    // with this one, do not create an overlapping 3-page chain.
    if (current > 0 && canAutoPairAt(current - 1)) return false;
    return canAutoPairAt(current);
  })();
  const page = pages[current];
  const currentIsWide = isWide(page?.id);
  const manualSpread = layoutMode === "spread" && !!pages[current + 1] && !currentIsWide;
  const spread = manualSpread || (layoutMode === "auto" && autoSpread);
  const pairedSpread = spread && !!pages[current + 1] && !currentIsWide;
  const displayAsSpread = pairedSpread || currentIsWide;

  // Run edge-pair detection whenever current page changes.
  useEffect(() => {
    const cur = pages[current];
    const nxt = pages[current + 1];
    if (cur && nxt) detectPair(cur.image_url, nxt.image_url, pairKey(cur.id, nxt.id));
    // also look one further ahead so navigation feels instant
    const nxt2 = pages[current + 2];
    if (nxt && nxt2) detectPair(nxt.image_url, nxt2.image_url, pairKey(nxt.id, nxt2.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pages]);

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
            <Button variant="secondary" disabled={current === 0} onClick={() => goPage(current - (pairedSpread ? 2 : 1))}>
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

            <Button variant="secondary" disabled={current >= visiblePages - 1} onClick={() => goPage(current + (pairedSpread ? 2 : 1))}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
