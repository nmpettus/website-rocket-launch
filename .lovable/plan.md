## Root cause

The live site is blank because `index.html` references JavaScript/CSS files under `/assets/`, but those exact files are missing on Hostinger and return 404 HTML pages. The browser therefore never starts the React app.

The earlier `supabaseUrl is required` problem was also real, but the current live failure is an upload/build packaging issue: Hostinger has `index.html` from one build and an `assets` folder from another build (or no matching assets folder).

Confirmed: OpenRouter is not used anywhere in this project — it is not related.

## Permanent safeguards

1. Public Supabase fallbacks live in `src/lib/publicConfig.ts`, so Hostinger builds no longer depend on a local `.env` for the public anon key.
2. Vite outputs stable main filenames: `dist/assets/app.js` and `dist/assets/app.css`, preventing the hashed filename mismatch that caused the blank page.
3. `public/.htaccess` disables cache for HTML/JS/CSS and includes Hostinger SPA routing protections.
4. `scripts/verify-hostinger-build.mjs` runs automatically after every build and fails if required Hostinger files are missing.
5. `scripts/package-hostinger-upload.mjs` creates `hostinger-upload.zip` automatically. Upload this zip to `public_html` and extract it there so `index.html`, `.htaccess`, `assets/`, and uploads stay together.

## Upload process

```
npm run build
```

Then upload `hostinger-upload.zip` to Hostinger `public_html` and extract it there. Do not upload only `index.html`.