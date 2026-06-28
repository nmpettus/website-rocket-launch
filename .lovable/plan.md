## Plan: Bulletproof Hostinger Build & Upload

### Problem
Previous uploads have resulted in a blank white page on Hostinger. The root causes have been addressed (missing assets, Supabase config fallbacks, stable filenames, .htaccess), but the user needs a process that "just works" every time.

### What I Will Do

1. **Run `npm run build`** in the sandbox.
   - This triggers the existing pipeline: Vite build → verification script → zip packaging.
   - The verification script will confirm `dist/` contains `index.html`, `.htaccess`, `assets/app.js`, and `assets/app.css`.

2. **Inspect the built `dist/index.html`** to confirm:
   - The dev entry `/src/main.tsx` has been replaced by `./assets/app.js`.
   - No absolute root paths (`/assets/...`) leaked into the production HTML.
   - The visible "Loading Books by Maggie…" fallback is present.

3. **If any build-time issue is found**, fix it immediately (e.g., broken `base` config, missing asset, or bad HTML preload).

4. **Deliver the upload artifact**:
   - The `hostinger-upload.zip` file is generated automatically by the build script.
   - I will provide a direct download path or confirm it exists in the project root.

5. **Provide a concise, numbered upload checklist**:
   - Log in to Hostinger hPanel → File Manager → `public_html`.
   - **Delete everything** inside `public_html` (old `assets/`, old `index.html`, old `.htaccess`).
   - Upload `hostinger-upload.zip` into `public_html`.
   - Extract the zip **inside** `public_html` so `index.html` sits at `public_html/index.html`.
   - Confirm `.htaccess` is visible (show hidden files if needed).
   - Hard-refresh the live site.

### Technical Details
- `vite.config.ts` already uses `base: './'` and stable filenames (`app.js`, `app.css`).
- `App.tsx` already uses `HashRouter`.
- `public/.htaccess` already handles SPA routing and cache-busting.
- `src/lib/publicConfig.ts` already bakes in the Supabase URL and anon key so missing env vars cannot crash the site.

### Outcome
A single zip file the user can upload to Hostinger `public_html`, extract, and have the site work without blank pages.