import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - Vite worker import
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ChevronFirst, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

(pdfjsLib as any).GlobalWorkerOptions.workerPort = new PdfWorker();

interface PdfCanvasViewerProps {
  url: string;
  title: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

/**
 * Renders a PDF with pdf.js into canvases so it works in every browser,
 * including ones that refuse to display PDFs inline.
 */
const PdfCanvasViewer = ({ url, title }: PdfCanvasViewerProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const scroller = scrollRef.current;
    const container = pagesRef.current;
    if (!container || !scroller) return;

    const render = async () => {
      setLoading(true);
      setError(null);
      container.innerHTML = "";
      try {
        const buf = await (await fetch(url)).arrayBuffer();
        if (cancelled) return;
        const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
        if (cancelled) return;
        setNumPages(pdf.numPages);

        const available = Math.max(240, (scroller.clientWidth || 800) - 32);

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const cssWidth = available * zoom;
          const scale = cssWidth / base.width;
          const viewport = page.getViewport({ scale });
          const dpr = Math.min(window.devicePixelRatio || 1, 2);

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.className = "rounded-md shadow-sm mx-auto block mb-4 bg-white max-w-none";
          canvas.dataset.page = String(i);
          canvas.setAttribute("aria-label", `${title} page ${i}`);
          container.appendChild(canvas);

          const ctx = canvas.getContext("2d")!;
          ctx.scale(dpr, dpr);
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (i === 1) setLoading(false);
        }
        setLoading(false);
      } catch (e) {
        console.error("PDF render failed", e);
        if (!cancelled) {
          setError("We couldn't render this PDF here.");
          setLoading(false);
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [url, title, zoom]);

  // Track which page is in view
  useEffect(() => {
    const scroller = scrollRef.current;
    const container = pagesRef.current;
    if (!scroller || !container) return;
    const onScroll = () => {
      const mid = scroller.scrollTop + scroller.clientHeight / 2;
      const canvases = Array.from(container.children) as HTMLElement[];
      for (let i = 0; i < canvases.length; i++) {
        const el = canvases[i];
        if (el.offsetTop <= mid && el.offsetTop + el.offsetHeight >= mid) {
          setCurrent(i + 1);
          return;
        }
      }
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [numPages, zoom]);

  const goToPage = useCallback((n: number) => {
    const container = pagesRef.current;
    const scroller = scrollRef.current;
    if (!container || !scroller) return;
    const target = container.children[n - 1] as HTMLElement | undefined;
    if (!target) return;
    scroller.scrollTo({ top: target.offsetTop - 8, behavior: "smooth" });
    setCurrent(n);
  }, []);

  const zoomBy = (delta: number) =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2))));

  // Tap / swipe navigation
  const gesture = useRef<{ x: number; y: number; t: number; scroll: number } | null>(null);

  const nextPage = useCallback(() => {
    setCurrent((c) => {
      const n = Math.min(numPages || 1, c + 1);
      goToPage(n);
      return c;
    });
  }, [numPages, goToPage]);

  const prevPage = useCallback(() => {
    setCurrent((c) => {
      const n = Math.max(1, c - 1);
      goToPage(n);
      return c;
    });
  }, [goToPage]);

  const onPointerDown = (e: React.PointerEvent) => {
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      scroll: scrollRef.current?.scrollTop ?? 0,
    };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || !scrollRef.current) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const dt = Date.now() - g.t;
    const scrolled = Math.abs((scrollRef.current.scrollTop ?? 0) - g.scroll) > 4;

    // Horizontal swipe
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? nextPage() : prevPage();
      return;
    }

    // Tap on left/right edge zone
    if (!scrolled && dt < 350 && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const rect = scrollRef.current.getBoundingClientRect();
      const rel = (e.clientX - rect.left) / rect.width;
      if (rel > 0.75) nextPage();
      else if (rel < 0.25) prevPage();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar: zoom */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b shrink-0">
        <Button size="icon" variant="outline" aria-label="Zoom out" onClick={() => zoomBy(-0.25)} disabled={zoom <= MIN_ZOOM}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground w-14 text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <Button size="icon" variant="outline" aria-label="Zoom in" onClick={() => zoomBy(0.25)} disabled={zoom >= MAX_ZOOM}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setZoom(1)} aria-label="Fit to width">
          <Maximize2 className="w-4 h-4 mr-1" /> Fit
        </Button>
      </div>

      {/* Pages */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="flex-1 overflow-auto p-4 bg-muted/30 relative touch-pan-y select-none"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-muted-foreground z-10 bg-muted/40">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading pages…
          </div>
        )}
        {error && (
          <div className="p-6 text-center space-y-3">
            <p className="text-muted-foreground">{error}</p>
            <Button asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open PDF in a new tab
              </a>
            </Button>
          </div>
        )}
        <div ref={pagesRef} />
      </div>

      {/* Bottom bar: page navigation */}
      {!error && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-3 border-t bg-background shrink-0">
          <span className="w-full text-center text-xs text-muted-foreground">
            Tip: swipe left or right — or tap the left/right edge — to turn pages
          </span>
          <Button size="sm" variant="outline" onClick={() => goToPage(1)} disabled={current <= 1}>
            <ChevronFirst className="w-4 h-4 mr-1" /> Start
          </Button>
          <Button size="sm" variant="outline" onClick={() => goToPage(current - 1)} disabled={current <= 1}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-foreground font-medium px-2 tabular-nums">
            Page {current}{numPages ? ` of ${numPages}` : ""}
          </span>
          <Button size="sm" variant="outline" onClick={() => goToPage(current + 1)} disabled={!numPages || current >= numPages}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfCanvasViewer;
