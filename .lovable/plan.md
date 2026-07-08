## Problem

`src/pages/BookReader.tsx` loads slowly for God's Love (51 pages) because of three compounding issues:

1. **Background sampling loop downloads every full-size page image.** As soon as `pages` load, `useEffect` on line 188 iterates all 51 pages sequentially and does `new Image()` with `crossOrigin="anonymous"` on the full-resolution originals just to sample edge pixels for spread detection. That's ~51 large image downloads competing with the current page.
2. **Cache-bust query defeats HTTP caching.** Line 220 appends `?v=<updated_at OR Date.now()>`. When `updated_at` is missing it uses `Date.now()`, giving every visit a fresh URL and forcing re-download every time.
3. **No prioritization / neighbor preload.** The visible page image has no `fetchpriority`/`decoding` hints and there's no small preload of just the next page — so the reader competes with 50 background canvas fetches.

## Fix (frontend only, single file: `src/pages/BookReader.tsx`)

1. **Kill the "sample everything" loop.** Replace the effect on lines 188–206 with an on-demand sampler that only samples the current page and its immediate neighbors (`current-1`, `current`, `current+1`, `current+2`) when needed for auto-spread detection. This drops parallel/background network use from 51 images to at most 3–4.
2. **Stable cache key, no per-load busting.** In the URL resolver (lines 220–232), only append `?v=` when `row.updated_at` exists (use its ISO string). Never fall back to `Date.now()`. Result: browser + CDN cache the image across page turns and sessions.
3. **Preload only current + next image.** After `pages` load and whenever `current` changes, `new Image().src = pages[current+1].image_url` (and `current+2` if spread). Add `decoding="async"` and `fetchpriority="high"` (via `{...({ fetchpriority: "high" } as any)}`) to the currently-visible `<img>`, and `fetchpriority="low"` + `decoding="async"` to the right-hand spread image.
4. **Skip the canvas edge-sample entirely when it isn't needed.** In `single` layout mode (which is now the default per the recent change), never call `samplePage` — spread detection is unused. Only run sampling in `auto` mode for the visible pair.
5. **Lower-res edge sampling.** When `samplePage` does run, request a smaller intrinsic size by drawing from the already-loaded `<img>` element (via a ref map) instead of a second `new Image()` fetch, so it reuses the current display request.

## Not changing

- No backend/storage/RLS changes.
- No changes to signed-URL generation TTL, layout, styling, or the reader UI.
- Spread auto-detect still works for the current spread — just no longer eagerly computed for all 51 pages.

## Technical notes

- Effect at lines 188–206: delete; replace with a small effect keyed on `[current, layoutMode, pages.length]` that samples only `pages[current-1..current+2]`.
- `bust()` helper (lines 220–223): return `url` unchanged when `!row.updated_at`.
- `<img>` at line 495 gets `fetchpriority="high"` + `decoding="async"`; the spread partner at line 504 gets `fetchpriority="low"` + `decoding="async"` + `loading="eager"`.
- Add a hidden preloader effect: `useEffect(() => { [1,2].forEach(o => { const p = pages[current+o]; if (p) { const i = new Image(); i.decoding = "async"; i.src = p.image_url; } }); }, [current, pages]);`

## Expected result

First page renders as fast as one image download. Page turns become near-instant once the next image is preloaded. No more 51-image background fetch storm on open.
