import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAnonKey, supabaseUrl } from "@/lib/publicConfig";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, Play, Pause, Square, Lock, BookOpen, FileText, LayoutTemplate } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";

import { toast } from "@/hooks/use-toast";
import { getCachedImageUrl, prefetchImages, hasCachedImage, cacheAllImages } from "@/lib/imageCache";
import { CloudDownload, CheckCircle2 } from "lucide-react";

interface Book { id: string; slug: string; title: string; page_count: number; is_free: boolean; content_type?: string; credit_cost?: number; }
interface Page { id: string; page_number: number; image_url: string; narration_text: string | null; updated_at?: string | null; }

const PREVIEW_LIMIT = 3;

export default function BookReader() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subscriptionLoading } = useSubscription();
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"auto" | "single" | "spread">("single");
  const [fit, setFit] = useState<"contain" | "cover">("contain");
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [pairs, setPairs] = useState<Record<string, boolean>>({});
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, (string | null)[]>>(new Map());
  const inflightAudioRef = useRef<Map<string, Promise<string | null>[]>>(new Map());
  const gated = !!book && !isActive && !book.is_free && !unlocked;
  const readablePages = useMemo(
    () => gated
      ? pages.filter((p) => p.page_number >= 1 && p.page_number <= PREVIEW_LIMIT)
      : pages,
    [gated, pages],
  );
  const visiblePages = readablePages.length;

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
    const lp = readablePages.find((p) => p.id === leftId);
    const rp = readablePages.find((p) => p.id === rightId);
    if (!lp || !rp) return;
    await Promise.all([samplePage(leftId, lp.image_url), samplePage(rightId, rp.image_url)]);
    computePairFromCache(leftId, rightId, key);
  };

  const pairKey = (a?: string, b?: string) => (a && b ? `${a}|${b}` : "");

  const canAutoPairAt = (index: number) => {
    const cur = readablePages[index];
    const nxt = readablePages[index + 1];
    if (!cur || !nxt) return false;
    if (isWide(cur.id) || isWide(nxt.id)) return false;
    return pairs[pairKey(cur.id, nxt.id)] === true;
  };

  const autoSpread = canAutoPairAt(current);

  const page = readablePages[current];
  const currentIsWide = isWide(page?.id);
  const manualSpread = layoutMode === "spread" && !!readablePages[current + 1] && !currentIsWide;
  const landscapeAutoSpread =
    preferLandscapeSpread && layoutMode === "auto" && !!readablePages[current + 1] && !currentIsWide;
  const spread = manualSpread || landscapeAutoSpread || (layoutMode === "auto" && autoSpread);
  const pairedSpread = spread && !!readablePages[current + 1] && !currentIsWide;
  const displayAsSpread = pairedSpread || currentIsWide;


  // On-demand: only sample pages around the current view when in auto mode.
  // Avoids downloading all 51 images just to detect spreads.
  useEffect(() => {
    if (readablePages.length === 0) return;
    if (layoutMode !== "auto") return;
    let cancelled = false;
    (async () => {
      const indices = [current - 1, current, current + 1, current + 2].filter(
        (i) => i >= 0 && i < readablePages.length
      );
      for (const i of indices) {
        if (cancelled) return;
        await samplePage(readablePages[i].id, readablePages[i].image_url);
        for (const j of [i - 1, i]) {
          const a = readablePages[j], b = readablePages[j + 1];
          if (a && b) computePairFromCache(a.id, b.id, pairKey(a.id, b.id));
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readablePages, current, layoutMode]);

  // Persistent image cache — resolve each page URL to a cached blob URL from
  // IndexedDB so revisits load instantly with no network fetch.
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const p of readablePages) {
        if (cancelled) return;
        if (!p.image_url || resolvedUrls[p.id]) continue;
        const url = await getCachedImageUrl(p.image_url);
        if (cancelled) return;
        setResolvedUrls((prev) => (prev[p.id] ? prev : { ...prev, [p.id]: url }));
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readablePages]);
  const urlFor = (p: Page) => resolvedUrls[p.id] || p.image_url;

  useEffect(() => {
    if (visiblePages === 0) {
      if (current !== 0) setCurrent(0);
      return;
    }
    if (current > visiblePages - 1) setCurrent(visiblePages - 1);
  }, [current, visiblePages]);

  // Preload upcoming images (via the persistent cache) so page turns are instant.
  useEffect(() => {
    const offsets = displayAsSpread ? [1, 2, 3, 4] : [1, 2];
    const urls: string[] = [];
    for (const offset of offsets) {
      const p = readablePages[current + offset];
      if (p?.image_url) urls.push(p.image_url);
    }
    prefetchImages(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, readablePages, displayAsSpread]);

  // Track whether the current spread + next spread are fully cached in
  // IndexedDB so the user knows they can safely go offline.
  const [spreadOfflineReady, setSpreadOfflineReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const offsets = displayAsSpread ? [0, 1, 2, 3] : [0, 1];
    const targets = offsets
      .map((o) => readablePages[current + o]?.image_url)
      .filter(Boolean) as string[];
    if (targets.length === 0) { setSpreadOfflineReady(false); return; }
    (async () => {
      // Ensure targets are cached, then re-check status.
      await cacheAllImages(targets);
      if (cancelled) return;
      const results = await Promise.all(targets.map(hasCachedImage));
      if (!cancelled) setSpreadOfflineReady(results.every(Boolean));
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, readablePages, displayAsSpread]);

  // Whole-book offline download state.
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ done: 0, total: 0 });
  const [bookOfflineReady, setBookOfflineReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (readablePages.length === 0) { setBookOfflineReady(false); return; }
      const results = await Promise.all(
        readablePages.map((p) => (p.image_url ? hasCachedImage(p.image_url) : Promise.resolve(true))),
      );
      if (!cancelled) setBookOfflineReady(results.every(Boolean));
    })();
    return () => { cancelled = true; };
  }, [readablePages, downloadProgress.done]);

  const downloadForOffline = async () => {
    if (downloading || readablePages.length === 0) return;
    setDownloading(true);
    const urls = readablePages.map((p) => p.image_url).filter(Boolean) as string[];
    setDownloadProgress({ done: 0, total: urls.length });
    try {
      await cacheAllImages(urls, (done, total) => setDownloadProgress({ done, total }));
      toast({ title: "Ready offline", description: "This whole book is now saved for offline reading." });
    } catch {
      toast({ title: "Download incomplete", description: "Some pages could not be cached. Try again.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  // Track which page images have finished loading so a two-page spread can
  // reveal both halves at the same instant instead of popping in one-by-one.
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const markLoaded = (id: string) =>
    setLoadedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  const leftLoaded = page ? !!loadedImages[page.id] : false;
  const rightPage = pairedSpread ? readablePages[current + 1] : null;
  const rightLoaded = rightPage ? !!loadedImages[rightPage.id] : true;
  const spreadReady = leftLoaded && rightLoaded;






  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data: b } = await supabase.from("books").select("*").eq("slug", slug).maybeSingle();
      if (!b) { setLoading(false); return; }
      setBook(b as Book);

      if (user) {
        const { data: unlock } = await supabase
          .from("unlocks")
          .select("id")
          .eq("user_id", user.id)
          .eq("book_id", b.id)
          .maybeSingle();
        setUnlocked(!!unlock);

        const { getStripeEnvironment } = await import("@/lib/stripe");
        const { data: bal } = await supabase.rpc("ensure_and_get_credit_balance", {
          _user_id: user.id,
          _environment: getStripeEnvironment(),
        });
        setCreditBalance(bal ?? 0);
      }

      const { data: p } = await supabase
        .from("book_pages")
        .select("*")
        .eq("book_id", b.id)
        .lte("page_number", b.page_count)
        .order("page_number");
      const rows = (p || []) as Page[];
      // Only add a version query when we have a real updated_at, so the browser/CDN
      // can cache across visits. Never use Date.now() (would bust cache every load).
      const bust = (url: string, row: Page) => {
        if (!row.updated_at) return url;
        const v = encodeURIComponent(row.updated_at);
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

  // Printed pages wrap mid-sentence; keep line breaks from becoming spoken pauses.
  const normalizeNarration = (text: string): string =>
    text
      .replace(/\r\n?/g, "\n")
      .replace(/(\w)-\n(\w)/g, "$1$2")          // de-hyphenate words split across lines
      .replace(/\n{2,}/g, "\u0000")              // mark real paragraph breaks
      .replace(/\n/g, " ")                       // wrapped lines flow together
      .replace(/\u0000/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

  const splitForTTS = (text: string): string[] => {
    // Split only at sentence-ending punctuation, never at a bare line break.
    const sentences = text.match(/[^.!?]+[.!?]*["'’”)\]]*\s*/g) ?? [text];
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
    const page = readablePages[current];
    if (!page) return null;
    const leftText = normalizeNarration(await extractTextForPage(page));
    let combined = leftText;
    let cacheKey = page.id;
    if (spread && readablePages[current + 1]) {
      const rightText = normalizeNarration(await extractTextForPage(readablePages[current + 1]));
      if (rightText) combined = leftText ? `${leftText}\n\n${rightText}` : rightText;
      cacheKey = `${page.id}+${readablePages[current + 1].id}`;
    }
    if (!combined) return null;

    return { cacheKey, text: combined };
  };

  // Prefetch audio for current + next page so playback starts instantly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!readablePages[current]) return;
      const built = await buildSpeech();
      if (cancelled || !built) return;
      fetchAudioChunks(built.cacheKey, built.text);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, spread, readablePages]);

  const speakCurrent = async () => {
    const page = readablePages[current];
    if (!page) return;
    stopSpeech();
    setLoadingAudio(true);
    let text = "";
    try {
      const built = await buildSpeech();
      if (!built) {
        toast({ title: "No narration", description: "No narration text could be found on this page.", variant: "destructive" });
        return;
      }
      text = built.text;
      const chunkPromises = fetchAudioChunks(built.cacheKey, built.text);
      const firstUrl = await chunkPromises[0];
      if (!firstUrl) {
        toast({ title: "Narration unavailable", description: "Azure voice service is temporarily unavailable. Please try again shortly.", variant: "destructive" });
        return;
      }
      setSpeaking(true);
      setLoadingAudio(false);
      let cancelled = false;
      const stopHandle = () => { cancelled = true; };
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
      (audioRef as any).__cancelChain = stopHandle;
      void playSequence();
      return;
    } catch (e) {
      console.error("Azure TTS error", e);
      toast({ title: "Narration failed", description: "Could not load Azure narration. Please try again.", variant: "destructive" });
      setSpeaking(false);
    } finally {
      setLoadingAudio(false);
    }
  };





  const goPage = (n: number) => {
    stopSpeech();
    setCurrent(Math.max(0, Math.min(visiblePages - 1, n)));
  };

  const spendCredits = async () => {
    if (!user || !book) return;
    setUnlocking(true);
    try {
      const { data, error } = await supabase.rpc("spend_credits", { _book_id: book.id });
      if (error) throw error;
      const result = data as { success: boolean; error?: string; credits_remaining?: number };
      if (!result.success) throw new Error(result.error || "Could not unlock book");
      setUnlocked(true);
      setCreditBalance(result.credits_remaining ?? null);
      toast({ title: "Unlocked!", description: `You now have full access to ${book.title}.` });
    } catch (e: any) {
      toast({ title: "Unlock failed", description: e.message || "Not enough credits or an error occurred.", variant: "destructive" });
    } finally {
      setUnlocking(false);
    }
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

  if (loading || authLoading || subscriptionLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p>Book not found.</p>
      <Link to="/members"><Button variant="outline">Back to Library</Button></Link>
    </div>
  );

  const showPaywallNext = gated && current >= visiblePages - 1 && book.page_count > PREVIEW_LIMIT;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/members" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Library
        </Link>
        <div className="text-sm text-white/70 flex items-center gap-3">
          <span>{book.title} — Page {page?.page_number ?? 0} of {book.page_count}</span>
          {spreadOfflineReady && (
            <span className="inline-flex items-center gap-1 text-emerald-400" title="Current & next spread cached for offline">
              <CheckCircle2 className="w-4 h-4" /> Offline ready
            </span>
          )}
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
                    ? `mx-auto flex max-w-full overflow-hidden rounded-none bg-transparent shadow-2xl ${heightClass} relative`
                    : "flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-white shadow-2xl relative"
                }
              >
                {(!spreadReady) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/40 z-10 pointer-events-none">
                    <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  </div>
                )}
                <div
                  className={displayAsSpread ? "flex shrink-0" : "flex min-h-0 flex-1 items-center justify-center"}
                  style={{ visibility: spreadReady ? "visible" : "hidden" }}
                >
                  <img
                    src={urlFor(page)}
                    alt={`Page ${page.page_number}`}
                    onLoad={(e) => {
                      recordAspect(page.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
                      markLoaded(page.id);
                    }}
                    decoding="async"
                    {...({ fetchpriority: "high" } as any)}
                    className={`block w-auto max-w-full object-contain ${heightClass}`}
                  />
                </div>
                {pairedSpread && rightPage && (
                  <div
                    className="flex shrink-0"
                    style={{ visibility: spreadReady ? "visible" : "hidden" }}
                  >
                    <img
                      src={urlFor(rightPage)}
                      alt={`Page ${rightPage.page_number}`}
                      onLoad={(e) => {
                        recordAspect(rightPage.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
                        markLoaded(rightPage.id);
                      }}
                      decoding="async"
                      {...({ fetchpriority: "high" } as any)}
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
              <p className="text-sm opacity-90 mb-4">
                {user
                  ? `Unlock this ${book?.credit_cost ?? 3}-credit book with your reading credits, or subscribe for unlimited access.`
                  : "Sign in to unlock the full story and the entire library."}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {user && (
                  <Button
                    variant="secondary"
                    onClick={spendCredits}
                    disabled={unlocking || (creditBalance !== null && creditBalance < (book?.credit_cost ?? 3))}
                  >
                    {unlocking ? "Unlocking…" : `Unlock for ${book?.credit_cost ?? 3} credits`}
                    {creditBalance !== null && (
                      <span className="ml-2 text-xs opacity-80">({creditBalance} left)</span>
                    )}
                  </Button>
                )}
                <Button variant="secondary" onClick={() => navigate(user ? "/join" : "/auth")}>
                  {user ? "Start Free Trial" : "Sign In to Subscribe"}
                </Button>
              </div>
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
              <ToggleGroup
                type="single"
                value={layoutMode}
                onValueChange={(v) => { if (v) setLayoutMode(v as "auto" | "single" | "spread"); }}
                variant="outline"
                className="flex-wrap justify-center"
              >
                <ToggleGroupItem value="auto" aria-label="Auto layout" title="Auto detects spreads from page shape">
                  <LayoutTemplate className="w-4 h-4 mr-1" /> Auto
                </ToggleGroupItem>
                <ToggleGroupItem value="single" aria-label="Single page">
                  <FileText className="w-4 h-4 mr-1" /> Single Page
                </ToggleGroupItem>
                <ToggleGroupItem value="spread" aria-label="Two-page spread">
                  <BookOpen className="w-4 h-4 mr-1" /> Two-Page Spread
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" onClick={() => setFit((f) => (f === "contain" ? "cover" : "contain"))} className="text-foreground">
                {fit === "contain" ? "Fill Page" : "Fit Page"}
              </Button>
              <Button
                variant="outline"
                onClick={downloadForOffline}
                disabled={downloading || bookOfflineReady}
                className="text-foreground"
                title="Cache every page in this book for offline reading"
              >
                {bookOfflineReady ? (
                  <><CheckCircle2 className="w-4 h-4 mr-1" /> Saved Offline</>
                ) : downloading ? (
                  <><CloudDownload className="w-4 h-4 mr-1 animate-pulse" /> Saving {downloadProgress.done}/{downloadProgress.total}</>
                ) : (
                  <><CloudDownload className="w-4 h-4 mr-1" /> Save for Offline</>
                )}
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
