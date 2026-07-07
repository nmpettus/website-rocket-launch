## Goal
Add a custom "forgot password" email sent through your existing Hostinger PHP mailer, with a large, clearly visible button — without touching any of the working email flows (Contact, Newsletter, Letter to Maggie).

## Isolation Guarantees (why existing email won't break)

All new code lives in **new files only**. No existing files that handle email are modified:

- `api/config.php` — untouched (SMTP creds reused read-only)
- `api/contact.php` — untouched
- `api/newsletter.php` — untouched
- `api/letter-to-maggie.php` — untouched
- `api/vendor/` (PHPMailer) — untouched
- `src/utils/titanEmailUtils.ts` — untouched
- `src/components/activities/LetterToMaggie.tsx` — untouched
- `src/components/sections/NewsLetter.tsx` — untouched
- `src/components/sections/Contact.tsx` — untouched

The only existing file modified is `src/pages/Auth.tsx`, and only the "Forgot password" click handler — the sign-in and sign-up logic stays exactly as it is.

## New Files

1. **`api/password-reset.php`** — new PHP endpoint, mirrors the exact pattern of `letter-to-maggie.php` (same PHPMailer setup, same CORS headers, same config.php include). Accepts `{ recipient_email, reset_link, user_name? }` and sends a branded HTML email with a large light-colored button.

2. **`supabase/functions/send-password-reset/index.ts`** — new edge function that:
   - Takes `{ email }` from the client
   - Uses Supabase admin client to call `generateLink({ type: 'recovery', ... })` with the correct redirect URL (`https://booksbymaggie.com/?reset-password=1#/reset-password`)
   - POSTs to `https://booksbymaggie.com/api/password-reset.php` with the generated link
   - Returns success/failure

3. **`supabase/config.toml`** — add the new function entry (append only, existing functions untouched).

## Modified File (minimal)

**`src/pages/Auth.tsx`** — replace the single line that calls `supabase.auth.resetPasswordForEmail(...)` inside the forgot-password handler with a call to `supabase.functions.invoke('send-password-reset', { body: { email } })`. Nothing else changes.

## Email Design

- Large heading, friendly copy matching your brand voice
- **Big button**: light background (e.g. your accent color), dark bold text, ~16px padding, 8px radius, minimum 200px wide — impossible to miss
- Plain-text fallback link below the button
- Maggie logo at top
- "From: Maggie <maggie@booksbymaggie.com>"

## Deployment Steps (after you approve)

1. I create the files above.
2. You upload the new `api/password-reset.php` to Hostinger (single file, drops into your existing `api/` folder alongside the working ones).
3. Edge function auto-deploys.
4. Test: click "Forgot password" on Auth page → check inbox → confirm big visible button → click → reset works.

## What Stays Exactly the Same

- Supabase's default password reset email still exists but is no longer triggered from your app.
- All other Supabase auth emails (signup confirmation, etc.) continue using Supabase defaults — unchanged.
- Contact form, newsletter signup, and Letter to Maggie continue using their existing PHP endpoints — unchanged.
- SMTP credentials, PHPMailer version, `api/config.php` — unchanged.

## Rollback

If anything looks off, revert `src/pages/Auth.tsx` (one function) and the forgot-password flow falls back to Supabase's default email instantly. The new PHP file and edge function can sit unused with zero side effects.
