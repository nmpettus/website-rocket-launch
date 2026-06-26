## Admin Book Uploader

Build a password-protected admin page where you drag-and-drop a folder of PNG pages for a book, and the app uploads them, OCRs each page for narration text, and registers the book in the reader library.

### What you'll do
1. Visit `/#/admin/books`, sign in with your admin email.
2. Fill in book title, slug, description, cover, and toggle "first 3 pages free preview".
3. Drag a folder of PNGs (named `01.png`, `02.png`, … to set page order).
4. Click **Upload**. Progress bar shows upload + OCR per page.
5. Edit any auto-extracted narration text inline before saving.
6. Book appears immediately in `/#/members` and is readable via `/#/read/<slug>`.

### Backend changes
- **Storage bucket** `book-pages` (private). RLS on `storage.objects`:
  - Admins: full read/write.
  - Authenticated subscribers + anon: read via signed URLs only (reader already gates by `page_number`).
- **`user_roles` table + `app_role` enum + `has_role()` security-definer function** (per workspace pattern). Seed your account as `admin`.
- **`books` / `book_pages` RLS update**: add admin INSERT/UPDATE/DELETE policies using `has_role(auth.uid(),'admin')`.
- **Edge function `ocr-page`**: receives a page image URL, calls Lovable AI Gateway (Gemini vision) to extract narration text, returns it. Used during upload to pre-fill `narration_text`.

### Frontend changes
- New route `/admin/books` (gated by `has_role` check; non-admins redirected to `/`).
- `AdminBookForm` component: book metadata + cover upload.
- `PageUploader` component: drag-drop, sorts by filename, uploads to `book-pages/<slug>/<n>.png`, calls `ocr-page` for each, shows editable narration textarea per page, then inserts rows into `books` + `book_pages`.
- Reader (`BookReader.tsx`) already works — no changes needed; it'll just pick up the new rows.

### File naming convention
Name your PNGs with zero-padded page numbers so order is unambiguous: `01.png, 02.png, 03.png, …`. The uploader sorts alphabetically.

### Out of scope (can add later)
- Editing an already-published book's pages (v1 is upload-once; re-upload replaces).
- Bulk re-OCR.
- Two-page spreads.

Ready to build?