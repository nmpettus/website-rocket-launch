## Plan: Lock in Hostinger deployment rules as permanent memory + project knowledge

### 1. Create a new memory file `mem://technical/hostinger-deployment`

Type: `constraint` + `feature` (deployment rules that must never regress).

Contents will cover the non-negotiables:

- **Routing**: `App.tsx` must use `HashRouter` (not `BrowserRouter`). Hostinger shared hosting + the way this site is uploaded into `public_html` requires hash routing to avoid 404s on refresh.
- **Vite config**: `base: './'` is required. Output filenames must stay stable: `assets/app.js` and `assets/app.css` (configured in `vite.config.ts` `rollupOptions.output`). Never switch to hashed filenames — the `.htaccess` no-cache rules and the verify script depend on these exact names.
- **`.htaccess`**: `public/.htaccess` must exist and contain `Options -MultiViews`, SPA rewrite to `/index.html`, MIME types for `.js`/`.mjs`/`.css`, and no-cache headers for html/js/css. Never delete or weaken this file.
- **Supabase fallbacks**: `src/lib/publicConfig.ts` must keep the hardcoded `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` fallbacks. Without them, a missing `VITE_SUPABASE_*` env var at build time produces a blank white page on Hostinger.
- **Error boundary + loading fallback**: `AppErrorBoundary` must wrap the app and `index.html` must keep the visible "Loading Books by Maggie…" fallback so a broken upload never shows a pure white page.
- **Build verification**: `scripts/verify-hostinger-build.mjs` runs as part of `npm run build`. Never bypass it. If it fails, fix the root cause — do not delete the check.
- **Packaging**: `scripts/package-hostinger-upload.mjs` produces `hostinger-upload.zip` containing the full `dist/` contents (including `.htaccess`). Upload the zip's contents into `public_html`, never just `index.html`.
- **Internal links**: Use `<Link to="/...">` from react-router, not `<a href="/...">`, so HashRouter handles them.
- **PDFs / public assets**: Use absolute paths from the site root so HashRouter doesn't mangle them.

### 2. Update `mem://index.md` Core section

Add one consolidated Core line so every future session sees it without opening the detail file:

> Hostinger deploy: HashRouter + `base:'./'` + stable `app.js`/`app.css` + `public/.htaccess` + `publicConfig.ts` Supabase fallbacks + visible loading fallback. Never weaken `scripts/verify-hostinger-build.mjs`. See `mem://technical/hostinger-deployment`.

And add the detail file to the Memories list:

> - [Hostinger Deployment](mem://technical/hostinger-deployment) — Non-negotiable rules: HashRouter, base './' , stable filenames, .htaccess, publicConfig fallbacks, verify script

### 3. No code changes

This is purely a memory/knowledge update. All the technical fixes are already in the repo from prior turns; this plan only makes the rules permanent across future sessions so I won't accidentally regress them (e.g. by switching to `BrowserRouter`, removing the publicConfig fallback, or letting hashed filenames sneak back in).

### Outcome

Every future session — mine or another agent's — will have these Hostinger rules in context automatically and treat them as constraints, not suggestions.