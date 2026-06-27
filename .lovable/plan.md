## Problem
The Admin uploader has no obvious "Save" — the **Publish** button is the save action, but it's hidden until at least one page is added, and it sits inside the import card so users miss it. The free-preview chip on each page row also still says "(free preview)" for pages 1–3 instead of 4–6.

## Changes to `src/pages/AdminBooks.tsx`

1. **Always-visible action bar** pinned at the top of the form (and a duplicate at the bottom) with two buttons:
   - **Save draft** — upserts the book row (title, slug, description, cover, is_free) without requiring pages. Lets the author save metadata progress and come back later.
   - **Publish N pages** — current full publish flow (uploads pages + narration). Disabled with a tooltip ("Add pages first") when `pages.length === 0`, instead of being hidden.
   - **Auto-extract narration (AI)** stays next to Publish.

2. **Status line** under the buttons: "Not saved yet" / "Draft saved" / "Published — N pages" so the user can see state.

3. **Fix free-preview label**: change `p.pageNumber <= 3` to `p.pageNumber >= 4 && p.pageNumber <= 6` so the chip matches the actual preview window (pages 4–6).

4. **Helper text** at the top of the page: one short line explaining "Fill in the details, add pages (PDF/EPUB import or PNGs), then click Publish to save to the library."

No backend, schema, or routing changes — purely UX on the existing admin page.
