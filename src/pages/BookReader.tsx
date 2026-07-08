import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAnonKey, supabaseUrl } from "@/lib/publicConfig";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, Play, Pause, Square, Lock } from "lucide-react";

interface Book { id: string; slug: string; title: string; page_count: number; is_free: boolean; }
interface Page { id: string; page_number: number; image_url: string; narration_text: string | null; updated_at?: string | null; }

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

  // Track viewport orientation so mobile devices auto-show two-page spreads in landscape.
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1024,
    h: typeof window !== "undefined" ? window.innerHeight : 768,
  }));
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  const isLandscape = viewport.w > viewport.h;
  const isSmallScreen = viewport.w < 1024;
  // On phones/tablets in landscape, prefer a spread automatically.
  const preferLandscapeSpread = isSmallScreen && isLandscape;


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
  const landscapeAutoSpread =
    preferLandscapeSpread && layoutMode === "auto" && !!pages[current + 1] && !currentIsWide;
  const spread = manualSpread || landscapeAutoSpread || (layoutMode === "auto" && autoSpread);
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
      // Cache-bust so a re-uploaded page never shows the previous image.
      const bust = (url: string, row: Page) => {
        const v = encodeURIComponent(row.updated_at || String(Date.now()));
        return url.includes("?") ? `${url}&v=${v}` : `${url}?v=${v}`;
      };
      const resolved = await Promise.all(rows.map(async (row) => {
        if (!row.image_url) return row;
        if (row.image_url.startsWith("http") || row.image_url.startsWith("/")) {
          return { ...row, image_url: bust(row.image_url, row) };
        }
        const { data: signed } = await supabase.storage.from("book-pages").createSignedUrl(row.image_url, 3600);
        const signedUrl = signed?.signedUrl ?? row.image_url;
        return { ...row, image_url: bust(signedUrl, row) };
      }));
      setPages(resolved);
      setLoading(false);
    })();
    return () => { stopSpeech(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Record reading history for signed-in members (per-book upsert + last page).
  useEffect(() => {
    if (!user || !book || !page) return;
    const t = setTimeout(() => {
      supabase
        .from("reading_history")
        .upsert(
          {
            user_id: user.id,
            book_id: book.id,
            last_page_read: page.page_number,
            last_read_at: new Date().toISOString(),
          },
          { onConflict: "user_id,book_id" }
        )
        .then(({ error }) => {
          if (error) console.warn("reading_history upsert failed", error);
        });
    }, 800);
    return () => clearTimeout(t);
  }, [user, book, page]);


  const stopSpeech = () => {
    if ((audioRef as any).__cancelChain) { try { (audioRef as any).__cancelChain(); } catch {} }
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

  const splitForTTS = (text: string): string[] => {
    const sentences = text.match(/[^.!?\n]+[.!?]?\s*/g) ?? [text];
    const chunks: string[] = [];
    let buf = "";
    for (const s of sentences) {
      if ((buf + s).length > 160 && buf) { chunks.push(buf.trim()); buf = s; }
      else buf += s;
    }
    if (buf.trim()) chunks.push(buf.trim());
    return chunks.length ? chunks : [text];
  };

  const fetchOneChunk = async (text: string): Promise<string | null> => {
    try {
      const resp = await fetch(`${supabaseUrl}/functions/v1/azure-tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ text, voice: "en-US-SaraNeural" }),
      });
      const ct = resp.headers.get("Content-Type") || "";
      if (!resp.ok || ct.includes("application/json")) return null;
      const blob = await resp.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  };

  // Kick off parallel chunk fetches; cache promises so prefetch + click share work.
  const fetchAudioChunks = (cacheKey: string, text: string): Promise<string | null>[] => {
    const cached = audioCacheRef.current.get(cacheKey);
    if (cached) return cached.map((u) => Promise.resolve(u));
    const inflight = inflightAudioRef.current.get(cacheKey);
    if (inflight) return inflight;
    const chunks = splitForTTS(text);
    const promises = chunks.map((c) => fetchOneChunk(c));
    inflightAudioRef.current.set(cacheKey, promises);
    Promise.all(promises).then((urls) => {
      audioCacheRef.current.set(cacheKey, urls);
      inflightAudioRef.current.delete(cacheKey);
    });
    return promises;
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

  // Prefetch audio for current + next page so playback starts instantly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!pages[current]) return;
      const built = await buildSpeech();
      if (cancelled || !built) return;
      fetchAudioChunks(built.cacheKey, built.text);
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
      const chunkPromises = fetchAudioChunks(built.cacheKey, built.text);
      // Wait only for the FIRST chunk — start playback immediately while others continue downloading.
      const firstUrl = await chunkPromises[0];
      if (!firstUrl) {
        speakWithBrowser(text);
        return;
      }
      setSpeaking(true);
      setLoadingAudio(false);
      let cancelled = false;
      const stopHandle = () => { cancelled = true; };
      const prevStop = audioRef.current;
      // Sequentially play each chunk as it becomes ready.
      const playSequence = async () => {
        for (let i = 0; i < chunkPromises.length; i++) {
          if (cancelled) return;
          const url = i === 0 ? firstUrl : await chunkPromises[i];
          if (cancelled || !url) continue;
          await new Promise<void>((resolve) => {
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.onended = () => resolve();
            audio.onerror = () => resolve();
            audio.play().catch(() => resolve());
          });
        }
        if (!cancelled) setSpeaking(false);
      };
      // Attach cancel hook via audioRef pause path: stopSpeech() pauses audio and we detect end.
      (audioRef as any).__cancelChain = stopHandle;
      void playSequence();
      return;
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
        <div className={`w-full ${displayAsSpread ? "max-w-[100vw]" : "max-w-5xl"} flex flex-col`}>
          {page && (() => {
            // Use extra vertical space when the device is in landscape (esp. mobile),
            // so two-page spreads fill the screen.
            const heightClass = preferLandscapeSpread
              ? (fit === "cover" ? "max-h-[92svh]" : "max-h-[88svh]")
              : (fit === "cover" ? "max-h-[85vh]" : "max-h-[70vh]");
            const halfWidthClass = preferLandscapeSpread ? "max-w-[50vw]" : "max-w-[50vw]";
            return (
              <div
                className={
                  displayAsSpread
                    ? `mx-auto flex max-w-full overflow-hidden rounded-none bg-transparent shadow-2xl ${heightClass}`
                    : "flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-white shadow-2xl"
                }
              >
                <div className={displayAsSpread ? "flex shrink-0" : "flex min-h-0 flex-1 items-center justify-center"}>
                  <img
                    src={page.image_url}
                    alt={`Page ${page.page_number}`}
                    onLoad={(e) => recordAspect(page.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                    className={`block w-auto max-w-full object-contain ${heightClass}`}
                  />
                </div>
                {pairedSpread && pages[current + 1] && (
                  <div className="flex shrink-0">
                    <img
                      src={pages[current + 1].image_url}
                      alt={`Page ${pages[current + 1].page_number}`}
                      onLoad={(e) => recordAspect(pages[current + 1].id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                      className={`block w-auto ${halfWidthClass} object-contain ${heightClass}`}
                    />
                  </div>
                )}
              </div>
            );
          })()}


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
