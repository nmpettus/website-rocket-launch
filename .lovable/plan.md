## Root cause

Your live site is running an **old build** (`index-CboT9Fos.js`) that was produced before the Supabase env-var fallback was added. That build called `createClient(undefined, undefined)`, which throws `supabaseUrl is required` and leaves the page blank.

The deeper issue: when you run `npm run build` on your laptop for Hostinger, Vite reads `.env`. Your `.env` has `VITE_SUPABASE_URL` but **does not contain `VITE_SUPABASE_PUBLISHABLE_KEY`** (it's only injected automatically in the Lovable sandbox). So every Hostinger build is missing that key.

Confirmed: OpenRouter is not used anywhere in this project — it is not related.

## Fix plan

The Supabase URL and **publishable** (anon) key are safe to commit — they are public values already exposed in every browser request. We will hardcode them as the fallback inside the Supabase client so builds never depend on a local `.env`.

### 1. Update `src/integrations/supabase/client.ts`
Replace the placeholder fallbacks with the real public values:
- `SUPABASE_URL` → `https://ppzpihpzmvgqumjvxuvb.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` → the project's anon key (already public)

Env vars still win when present (so the Lovable preview keeps working), but Hostinger builds without a `.env` will now succeed.

### 2. Verify build locally
After the edit, on your machine:
```
npm run build
```
Then check that `dist/assets/index-*.js` contains the Supabase URL string (a quick sanity check).

### 3. Upload to Hostinger
- Delete the **entire** contents of `public_html` (especially the old `assets/` folder — old hashed JS files linger and confuse browsers).
- Upload the **new** `dist/` contents (including `index.html`, `assets/`, `.htaccess`, `lovable-uploads/`).
- Hard-refresh the site (Ctrl+Shift+R) to bypass the cached old bundle.

### 4. Confirm
Open `https://booksbymaggie.com/` — the home page should render. If anything still fails, the error boundary will now show "Reload Home" instead of a blank screen, and the console will name the real culprit.

## Notes
- No secrets are exposed by this change. The publishable/anon key is designed to live in client code; row-level security is what protects your data.
- `.env.production` and `.env.development` are unchanged.
- No other files need editing.