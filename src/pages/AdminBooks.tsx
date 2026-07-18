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
import { ArrowLeft, Loader2, Upload, Trash2, FileUp, Pencil, X, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTab } from "@/components/admin/MembersTab";

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
  const [existingBooks, setExistingBooks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);


  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?next=/admin/books");
  }, [authLoading, user, navigate]);

  const loadExistingBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("id, slug, title, page_count, is_free, created_at")
      .order("created_at", { ascending: false });
    setExistingBooks(data || []);
  };

  useEffect(() => {
    if (isAdmin) loadExistingBooks();
  }, [isAdmin]);

  const showDeleteProtected = (title: string) => {
    toast.error(`"${title}" was not deleted. Library books are protected from accidental removal.`);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setOriginalSlug(null);
    setExistingCoverUrl(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setCoverFile(null);
    setIsFree(false);
    setPages([]);
    setSaveState("unsaved");
  };

  const startEdit = async (bookId: string) => {
    setWorking(true);
    try {
      const { data: book, error } = await supabase
        .from("books")
        .select("id, slug, title, description, cover_image_url, is_free, page_count")
        .eq("id", bookId)
        .single();
      if (error) throw error;
      setEditingId(book.id);
      setOriginalSlug(book.slug);
      setTitle(book.title ?? "");
      setSlug(book.slug ?? "");
      setDescription(book.description ?? "");
      setIsFree(!!book.is_free);
      setExistingCoverUrl(book.cover_image_url ?? null);
      setCoverFile(null);
      setPages([]);
      setSaveState("draft");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(`Editing "${book.title}". Upload a new cover or manuscript to replace — leave empty to keep existing.`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load book");
    } finally {
      setWorking(false);
    }
  };

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const findBookBySlug = async (nextSlug: string) => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title, slug")
      .eq("slug", nextSlug)
      .maybeSingle();
    if (error) throw error;
    return data as { id: string; title: string; slug: string } | null;
  };

  const ensureSlugCanBeSaved = async () => {
    const existing = await findBookBySlug(slug);
    if (existing && existing.id !== editingId) {
      throw new Error(`The slug "${slug}" already belongs to "${existing.title}". Choose a different slug so no book can be overwritten.`);
    }
  };

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
      const { pdfToPageImages, epubToPageImages } = await import("@/lib/bookImport");
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

  const saveDraft = async () => {
    if (!title || !slug) return toast.error("Title and slug are required");
    setWorking(true);
    try {
      await ensureSlugCanBeSaved();
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const path = `${slug}/cover.${ext}`;
        const { error } = await supabase.storage.from("book-pages").upload(path, coverFile, { upsert: true });
        if (error) throw error;
        coverUrl = path;
      }
      if (editingId) {
        const patch: any = { slug, title, description, is_free: isFree };
        if (coverUrl) patch.cover_image_url = coverUrl;
        const { error: bookErr } = await supabase.from("books").update(patch).eq("id", editingId);
        if (bookErr) throw bookErr;
        setOriginalSlug(slug);
        if (coverUrl) setExistingCoverUrl(coverUrl);
      } else {
        const { data: bookRow, error: bookErr } = await supabase
          .from("books")
          .insert({
            slug,
            title,
            description,
            ...(coverUrl ? { cover_image_url: coverUrl } : {}),
            page_count: pages.length,
            is_free: isFree,
          })
          .select("id, slug, cover_image_url")
          .single();
        if (bookErr) throw bookErr;
        setEditingId(bookRow.id);
        setOriginalSlug(bookRow.slug);
        if (bookRow.cover_image_url) setExistingCoverUrl(bookRow.cover_image_url);
      }
      setSaveState("draft");
      toast.success("Draft saved");
      await loadExistingBooks();
    } catch (e) {
      console.error(e);
      toast.error("Save failed: " + String(e));
    } finally {
      setWorking(false);
    }
  };

  const publish = async () => {
    if (!title || !slug) return toast.error("Title and slug are required");
    if (!editingId && !pages.length) return toast.error("Add at least one page");
    setWorking(true);
    try {
      await ensureSlugCanBeSaved();
      // Upload cover (if provided) to book-pages/<slug>/cover.<ext>
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const path = `${slug}/cover.${ext}`;
        const { error } = await supabase.storage.from("book-pages").upload(path, coverFile, { upsert: true });
        if (error) throw error;
        coverUrl = path; // stored as path; reader will sign
      }

      let bookRow: { id: string; slug: string };
      if (editingId) {
        const patch: any = { slug, title, description, is_free: isFree };
        if (coverUrl) patch.cover_image_url = coverUrl;
        if (pages.length) patch.page_count = pages.length;
        const { data, error: bookErr } = await supabase
          .from("books")
          .update(patch)
          .eq("id", editingId)
          .select()
          .single();
        if (bookErr) throw bookErr;
        bookRow = data;
      } else {
        const { data, error: bookErr } = await supabase
          .from("books")
          .insert({
            slug,
            title,
            description,
            cover_image_url: coverUrl,
            page_count: pages.length,
            is_free: isFree,
          })
          .select()
          .single();
        if (bookErr) throw bookErr;
        bookRow = data;
      }

      // Only replace pages if new pages were provided (edit mode allows metadata/cover-only updates)
      if (pages.length) {
        if (editingId) {
          const confirmText = prompt(`Replacing pages for "${title}" will update page records without deleting the old library book. Type REPLACE to continue.`);
          if (confirmText !== "REPLACE") throw new Error("Page replacement cancelled");
        }
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i];
          setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "uploading" } : pp));
          const ext = p.file.name.split(".").pop() || "png";
          const path = `${slug}/${String(p.pageNumber).padStart(3, "0")}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("book-pages")
            .upload(path, p.file, { upsert: true, contentType: p.file.type || "image/png" });
          if (upErr) throw upErr;

          const { error: insErr } = await supabase
            .from("book_pages")
            .upsert({
              book_id: bookRow.id,
              page_number: p.pageNumber,
              image_url: path,
              narration_text: p.narration || null,
            }, { onConflict: "book_id,page_number" });
          if (insErr) throw insErr;
          setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, status: "done", storagePath: path } : pp));
        }
      }

      setSaveState("published");
      toast.success(
        editingId
          ? `"${title}" updated${pages.length ? ` — ${pages.length} pages replaced` : coverFile ? " — cover replaced" : ""}`
          : `"${title}" published to the library!`
      );
      await loadExistingBooks();
      navigate(`/read/${slug}`);
    } catch (e) {
      console.error(e);
      toast.error("Publish failed: " + String(e));
    } finally {
      setWorking(false);
    }
  };

  const ActionBar = () => (
    <div className="bg-card border rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3 sticky top-2 z-10 shadow-sm">
      <Button onClick={saveDraft} disabled={working || !title || !slug} variant="secondary">
        {working ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Save draft
      </Button>
      <Button onClick={ocrAll} disabled={working || !pages.length} variant="secondary">
        Auto-extract narration (AI)
      </Button>
      <Button
        onClick={publish}
        disabled={working || (!editingId && !pages.length) || !title || !slug}
        title={!editingId && !pages.length ? "Add pages first" : undefined}
      >
        <Upload className="w-4 h-4 mr-2" />
        {working
          ? `${editingId ? "Updating" : "Publishing"} ${progress}…`
          : editingId
            ? pages.length
              ? `Update & replace ${pages.length} pages`
              : "Update book"
            : `Publish${pages.length ? ` ${pages.length} pages` : ""}`}
      </Button>
      {editingId && (
        <Button onClick={cancelEdit} variant="ghost" disabled={working}>
          <X className="w-4 h-4 mr-1" /> Cancel edit
        </Button>
      )}
      <span className="text-xs text-muted-foreground ml-auto">
        {editingId && <span className="text-primary font-medium">Editing existing book · </span>}
        {saveState === "unsaved" && "Not saved yet"}
        {saveState === "draft" && "Draft saved"}
        {saveState === "published" && `Published — ${pages.length} pages`}
      </span>
    </div>
  );


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
        <h1 className="text-3xl font-bold mb-4">Admin</h1>

        <Tabs defaultValue="books">
          <TabsList className="mb-6">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersTab />
          </TabsContent>

          <TabsContent value="books">
        <p className="text-sm text-muted-foreground mb-4">
          Fill in the details, add pages (PDF/EPUB import or PNGs), then click <strong>Publish</strong> to save to the library. Use <strong>Save draft</strong> to store metadata without pages.
        </p>

        <div className="bg-card border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Existing Books ({existingBooks.length})</h2>
            <Button size="sm" variant="ghost" onClick={loadExistingBooks}>Refresh</Button>
          </div>
          {existingBooks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No books yet.</p>
          ) : (
            <ul className="divide-y">
              {existingBooks.map((b) => (
                <li key={b.id} className="py-2 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{b.title}</div>
                    <div className="text-xs text-muted-foreground">
                      /read/{b.slug} · {b.page_count ?? 0} pages {b.is_free ? "· free" : ""}
                    </div>
                  </div>
                  <Link to={`/read/${b.slug}`} className="text-xs text-primary hover:underline">Open</Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(b.id)}
                    disabled={working || editingId === b.id}
                    title="Edit this book — replace cover, metadata, or manuscript"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> {editingId === b.id ? "Editing" : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showDeleteProtected(b.title)}
                    title="Protected: books cannot be deleted from this uploader"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ActionBar />


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
            <Label htmlFor="cover">Cover image {editingId ? "(leave empty to keep existing)" : "(optional)"}</Label>
            <Input id="cover" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
            {editingId && existingCoverUrl && !coverFile && (
              <p className="text-xs text-muted-foreground mt-1">Current cover will be kept: <code>{existingCoverUrl}</code></p>
            )}
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
        </div>

        <ActionBar />



        <div className="space-y-3">
          {pages.map((p, idx) => (
            <div key={idx} className="bg-card border rounded-xl p-4 flex gap-4">
              <img src={p.previewUrl} alt={`Page ${p.pageNumber}`} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Page {p.pageNumber} {p.pageNumber >= 4 && p.pageNumber <= 6 && <span className="text-xs text-primary">(free preview)</span>}</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
