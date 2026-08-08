# Sell a downloadable PDF in the Reading Club (2 credits)

Yes — but the library today only supports books that are converted into page images for the reader. There is no way yet to store an original PDF and hand it to a member as a download. This plan adds that.

## How it will work for you

1. In Admin → Books, pick content type **Downloadable / Activity (2 credits)**.
2. A new **Downloadable file** field appears — upload your Etsy PDF as-is (it will not be sliced into reader pages).
3. Add a cover image, title and description as usual, then publish.

## How it will work for members

- The item shows in the Reading Club library with a **2 credits** badge, same as other titles.
- Instead of "Read", it shows **Unlock & Download (2 credits)**.
- Confirming spends 2 credits through the existing credit system and permanently records the unlock.
- After unlocking, the button becomes **Download PDF** — available forever, even after the subscription ends.
- Members who haven't unlocked it only see the cover and description; the file is never reachable without an unlock.

## Technical notes

- Add `download_path text` to `public.books` (nullable) for the storage key of the original file.
- Store the file in the existing private `book-pages` bucket at `<slug>/download.pdf`.
- Add a `get-download-url` edge function: verifies the caller's session, checks `unlocks` (or admin), then returns a short-lived signed URL. No public bucket, no client-side signing — the download cannot be shared or guessed.
- Reuse `spend_credits(book_id)` unchanged for the 2-credit charge and unlock row.
- Admin save/publish path: when `content_type` is a downloadable type, skip the PDF→page-image conversion and page upload, set `page_count = 0`, and upload the raw file instead.
- `src/pages/Members.tsx`: render a download card variant for books with `download_path` (unlock dialog → download button).
- Reader routing untouched; downloadable items don't open `BookReader`.
- No deletes anywhere — existing books, pages and storage objects are untouched.
