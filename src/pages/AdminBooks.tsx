import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, Trash2, FileUp } from "lucide-react";
import { pdfToPageImages, epubToPageImages } from "@/lib/bookImport";

interface PendingPage {
  file: File;
  pageNumber: number;
  previewUrl: string;
  status: "pending" | "uploading" | "ocr" | "done" | "error";
  narration: string;
  storagePath?: string;
  error?: string;
}

export default function AdminBooks() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [pages, setPages] = useState<PendingPage[]>([]);
  const [working, setWorking] = useState(false);
  const [importProgress, setImportProgress] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"unsaved" | "draft" | "published">("unsaved");


  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?next=/admin/books");
  }, [authLoading, user, navigate]);

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handlePageFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const mapped: PendingPage[] = list.map((file, i) => ({
      file,
      pageNumber: i + 1,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
      narration: "",
    }));
    setPages(mapped);
  };

  const handleDocumentImport = async (file: File | null) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    const isPdf = name.endsWith(".pdf") || file.type === "application/pdf";
    const isEpub = name.endsWith(".epub") || file.type === "application/epub+zip";
    if (!isPdf && !isEpub) {
      toast.error("Please choose a .pdf or .epub file");
      return;
    }
    setWorking(true);
    setImportProgress("Reading document…");
    try {
      const imported = isPdf
        ? await pdfToPageImages(file, {
            onProgress: (d, t) => setImportProgress(`Rendering PDF page ${d}/${t}…`),
          })
        : await epubToPageImages(file, {
            onProgress: (d, t) => setImportProgress(`Extracting EPUB ${d}/${t}…`),
          });
      const mapped: PendingPage[] = imported.map((p) => ({
        file: p.file,
        pageNumber: p.pageNumber,
        previewUrl: URL.createObjectURL(p.file),
        status: "pending",
        narration: "",
      }));
      setPages(mapped);
      if (!title) setTitle(file.name.replace(/\.(pdf|epub)$/i, ""));
      if (!slug) setSlug(slugify(file.name.replace(/\.(pdf|epub)$/i, "")));
      toast.success(`Imported ${mapped.length} pages from ${isPdf ? "PDF" : "EPUB"}`);
    } catch (e) {
      console.error(e);
      toast.error("Import failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setImportProgress(null);
      setWorking(false);
    }
  };

  const removePage = (idx: number) => {
    setPages((p) => p.filter((_, i) => i !== idx).map((pp, i) => ({ ...pp, pageNumber: i + 1 })));
  };

  const updateNarration = (idx: number, value: string) => {
    setPages((p) => p.map((pp, i) => (i === idx ? { ...pp, narration: value } : pp)));
  };

  const readAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const s = r.result as string;
        resolve(s.split(",")[1] ?? "");
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const ocrAll = async () => {
    if (!pages.length) return;
    setWorking(true);
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (p.narration) continue;
      setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "ocr" } : pp));
      try {
        const base64 = await readAsBase64(p.file);
        const { data, error } = await supabase.functions.invoke("ocr-page", {
          body: { imageBase64: base64, mimeType: p.file.type || "image/png" },
        });
        if (error) throw error;
        const text = (data as { text?: string })?.text ?? "";
        setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, narration: text, status: "pending" } : pp));
      } catch (e) {
        setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "error", error: String(e) } : pp));
      }
    }
    setWorking(false);
    toast.success("OCR complete. Review and edit narration text.");
  };

  const publish = async () => {
    if (!title || !slug) return toast.error("Title and slug are required");
    if (!pages.length) return toast.error("Add at least one page");
    setWorking(true);
    try {
      // Upload cover (if provided) to book-pages/<slug>/cover.<ext>
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const path = `${slug}/cover.${ext}`;
        const { error } = await supabase.storage.from("book-pages").upload(path, coverFile, { upsert: true });
        if (error) throw error;
        coverUrl = path; // stored as path; reader will sign
      }

      // Insert/upsert book by slug
      const { data: bookRow, error: bookErr } = await supabase
        .from("books")
        .upsert({
          slug,
          title,
          description,
          cover_image_url: coverUrl,
          page_count: pages.length,
          is_free: isFree,
        }, { onConflict: "slug" })
        .select()
        .single();
      if (bookErr) throw bookErr;

      // Remove existing pages for this book (re-upload replaces)
      await supabase.from("book_pages").delete().eq("book_id", bookRow.id);

      // Upload pages and insert rows
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "uploading" } : pp));
        const ext = p.file.name.split(".").pop() || "png";
        const path = `${slug}/${String(p.pageNumber).padStart(3, "0")}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("book-pages")
          .upload(path, p.file, { upsert: true, contentType: p.file.type || "image/png" });
        if (upErr) throw upErr;

        const { error: insErr } = await supabase.from("book_pages").insert({
          book_id: bookRow.id,
          page_number: p.pageNumber,
          image_url: path,
          narration_text: p.narration || null,
        });
        if (insErr) throw insErr;
        setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "done", storagePath: path } : pp));
      }

      toast.success(`"${title}" published to the library!`);
      navigate(`/read/${slug}`);
    } catch (e) {
      console.error(e);
      toast.error("Publish failed: " + String(e));
    } finally {
      setWorking(false);
    }
  };

  const progress = useMemo(() => {
    const done = pages.filter((p) => p.status === "done").length;
    return `${done}/${pages.length}`;
  }, [pages]);

  if (authLoading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Admin only</h1>
        <p className="text-muted-foreground">Your account ({user.email}) is not an admin.</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Book Uploader</h1>

        <div className="space-y-4 bg-card border rounded-xl p-6 mb-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL: /read/&lt;slug&gt;)</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div>
            <Label htmlFor="cover">Cover image (optional)</Label>
            <Input id="cover" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="free" checked={isFree} onCheckedChange={setIsFree} />
            <Label htmlFor="free">Free book (all pages public, no paywall)</Label>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 mb-6 space-y-5">
          <div>
            <Label htmlFor="doc" className="text-lg font-semibold flex items-center gap-2">
              <FileUp className="w-4 h-4" /> Import a PDF or EPUB
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Upload a complete book file — each PDF page (or EPUB image) becomes a page automatically.
            </p>
            <Input
              id="doc"
              type="file"
              accept=".pdf,.epub,application/pdf,application/epub+zip"
              onChange={(e) => handleDocumentImport(e.target.files?.[0] ?? null)}
              disabled={working}
            />
            {importProgress && (
              <p className="text-sm text-primary mt-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {importProgress}
              </p>
            )}
          </div>

          <div className="border-t pt-5">
            <Label htmlFor="pages" className="text-lg font-semibold">…or upload page images (PNGs)</Label>
            <p className="text-sm text-muted-foreground mb-3">Select all PNGs at once. They sort by filename — name them <code>01.png, 02.png, …</code></p>
            <Input id="pages" type="file" accept="image/*" multiple onChange={(e) => handlePageFiles(e.target.files)} />
          </div>
          {pages.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button onClick={ocrAll} disabled={working} variant="secondary">
                {working ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Auto-extract narration (AI)
              </Button>
              <Button onClick={publish} disabled={working}>
                <Upload className="w-4 h-4 mr-2" />
                {working ? `Publishing ${progress}…` : `Publish ${pages.length} pages`}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {pages.map((p, idx) => (
            <div key={idx} className="bg-card border rounded-xl p-4 flex gap-4">
              <img src={p.previewUrl} alt={`Page ${p.pageNumber}`} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Page {p.pageNumber} {p.pageNumber <= 3 && <span className="text-xs text-primary">(free preview)</span>}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{p.status}</span>
                    <Button size="icon" variant="ghost" onClick={() => removePage(idx)} disabled={working}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Narration text (read aloud)…"
                  value={p.narration}
                  onChange={(e) => updateNarration(idx, e.target.value)}
                  rows={3}
                />
                {p.error && <p className="text-xs text-destructive mt-1">{p.error}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
