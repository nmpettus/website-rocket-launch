import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - Vite worker import
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

(pdfjsLib as any).GlobalWorkerOptions.workerPort = new PdfWorker();

interface PdfCanvasViewerProps {
  url: string;
  title: string;
}

/**
 * Renders a PDF with pdf.js into canvases so it works in every browser,
 * including ones that refuse to embed PDFs inline.
 */
const PdfCanvasViewer = ({ url, title }: PdfCanvasViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const render = async () => {
      setLoading(true);
      setError(null);
      container.innerHTML = "";
      try {
        const buf = await (await fetch(url)).arrayBuffer();
        if (cancelled) return;
        const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
        const width = container.clientWidth || 800;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const scale = ((width - 24) / base.width) * zoom;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.className = "rounded-md shadow-sm mx-auto block mb-4 bg-white";
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b">
        <Button
          size="icon"
          variant="outline"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="icon"
          variant="outline"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3 bg-muted/30 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-muted-foreground">
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
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default PdfCanvasViewer;
