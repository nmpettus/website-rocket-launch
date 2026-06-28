// PDF / EPUB → array of page PNG Files for the admin uploader.
import * as pdfjsLib from "pdfjs-dist";
// Vite worker import
// @ts-ignore
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
import JSZip from "jszip";

(pdfjsLib as any).GlobalWorkerOptions.workerPort = new PdfWorker();

export interface ImportedPage {
  file: File;
  pageNumber: number;
}

/** Render every PDF page to a PNG File at the given target width (px). */
export async function pdfToPageImages(
  file: File,
  opts: { targetWidth?: number; onProgress?: (done: number, total: number) => void } = {}
): Promise<ImportedPage[]> {
  const targetWidth = opts.targetWidth ?? 1600;
  const buf = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
  const results: ImportedPage[] = [];

  const renderPageToBlob = async (i: number, attempt: number): Promise<Blob> => {
    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = targetWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d")!;
    // Paint white background so transparent PDFs aren't saved as blank.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
      background: "#ffffff",
    } as any).promise;
    // Blank-page guard: sample pixels; if nothing was drawn, re-render once.
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let nonWhite = 0;
    const step = Math.max(1, Math.floor(sample.length / 4 / 4000));
    for (let p = 0; p < sample.length; p += 4 * step) {
      if (sample[p] < 248 || sample[p + 1] < 248 || sample[p + 2] < 248) {
        nonWhite++;
        if (nonWhite > 10) break;
      }
    }
    if (nonWhite <= 10 && attempt < 2) {
      // Give fonts/images a tick to settle, then retry once.
      await new Promise((r) => setTimeout(r, 250));
      return renderPageToBlob(i, attempt + 1);
    }
    return await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), "image/png")
    );
  };

  for (let i = 1; i <= pdf.numPages; i++) {
    const blob = await renderPageToBlob(i, 0);
    const pageFile = new File(
      [blob],
      `${String(i).padStart(3, "0")}.png`,
      { type: "image/png" }
    );
    results.push({ file: pageFile, pageNumber: i });
    opts.onProgress?.(i, pdf.numPages);
  }
  return results;
}

/**
 * EPUB → page images.
 * Picture-book EPUBs typically have one image per spine item. We parse the OPF
 * spine, then for each spine HTML file we extract the first <img> reference
 * and pull that image out of the zip in spine order.
 * If a spine item has no image, it's skipped (text-only pages aren't supported
 * in the image-based reader).
 */
export async function epubToPageImages(
  file: File,
  opts: { onProgress?: (done: number, total: number) => void } = {}
): Promise<ImportedPage[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  // 1. Find OPF via container.xml
  const containerXml = await zip.file("META-INF/container.xml")?.async("string");
  if (!containerXml) throw new Error("Invalid EPUB: missing container.xml");
  const opfPath = new DOMParser()
    .parseFromString(containerXml, "application/xml")
    .querySelector("rootfile")
    ?.getAttribute("full-path");
  if (!opfPath) throw new Error("Invalid EPUB: missing OPF path");

  const opfDir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
  const opfXml = await zip.file(opfPath)!.async("string");
  const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");

  // 2. Manifest: id → href
  const manifest: Record<string, { href: string; mime: string }> = {};
  opfDoc.querySelectorAll("manifest > item").forEach((item) => {
    manifest[item.getAttribute("id")!] = {
      href: item.getAttribute("href")!,
      mime: item.getAttribute("media-type") || "",
    };
  });

  // 3. Spine order
  const spineIds = Array.from(opfDoc.querySelectorAll("spine > itemref")).map(
    (r) => r.getAttribute("idref")!
  );

  const results: ImportedPage[] = [];
  let pageNumber = 0;

  const resolveZipPath = (basePath: string, relHref: string) => {
    const baseDir = basePath.includes("/") ? basePath.slice(0, basePath.lastIndexOf("/") + 1) : "";
    const parts = (baseDir + relHref).split("/");
    const stack: string[] = [];
    for (const p of parts) {
      if (p === "..") stack.pop();
      else if (p && p !== ".") stack.push(p);
    }
    return stack.join("/");
  };

  for (let s = 0; s < spineIds.length; s++) {
    const item = manifest[spineIds[s]];
    if (!item) continue;
    const spinePath = opfDir + item.href;

    let imageHref: string | null = null;

    if (item.mime.startsWith("image/")) {
      imageHref = spinePath;
    } else {
      // HTML/XHTML → extract first image
      const html = await zip.file(spinePath)?.async("string");
      if (!html) continue;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const img =
        doc.querySelector("img")?.getAttribute("src") ||
        doc.querySelector("image")?.getAttribute("xlink:href") ||
        doc.querySelector("image")?.getAttribute("href");
      if (!img) continue;
      imageHref = resolveZipPath(spinePath, img);
    }

    const imgFile = zip.file(imageHref);
    if (!imgFile) continue;
    const blob = await imgFile.async("blob");
    const ext = imageHref.split(".").pop()?.toLowerCase() || "png";
    const mime =
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "webp" ? "image/webp" : "image/png";
    pageNumber++;
    const pageFile = new File(
      [blob],
      `${String(pageNumber).padStart(3, "0")}.${ext}`,
      { type: mime }
    );
    results.push({ file: pageFile, pageNumber });
    opts.onProgress?.(s + 1, spineIds.length);
  }

  if (!results.length) throw new Error("No images found in EPUB spine. This reader supports image-based picture books.");
  return results;
}
