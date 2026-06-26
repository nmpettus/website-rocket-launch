
# Maggie's Reading Club — Membership + Digital Reader

Add a paid membership area to booksbymaggie.com where parents subscribe ($4.99/mo or $49/yr with a 7-day free trial) and kids read Maggie's books online with a built-in read-aloud feature. Non-members can preview the first 3 pages of any paid book.

## What gets built

### 1. Backend foundation (Lovable Cloud + Stripe)
- Enable Lovable Cloud (auth + database).
- Enable Lovable's built-in Stripe payments (no Stripe account needed; test mode immediately, full digital-product compliance handling included).
- Create the subscription product in Stripe with two prices: $4.99/month and $49/year, both with a 7-day free trial.
- Database tables:
  - `profiles` — parent account info, linked to auth user.
  - `subscriptions` — Stripe customer id, subscription id, status, current_period_end, price tier.
  - `books` — id, title, slug, cover image, description, page_count, is_free flag, sort order.
  - `book_pages` — book_id, page_number, image_url, narration_text (the text spoken by read-aloud).
- RLS: parents read their own profile/subscription; book metadata readable by everyone; `book_pages` readable only to active subscribers (with first 3 pages exposed via a public view for the preview).
- Edge functions: `create-checkout`, `customer-portal`, `check-subscription`, plus a Stripe webhook to keep `subscriptions` in sync.

### 2. Auth + signup flow
- Email/password + Google sign-in for parents (kid-safe wording on the form).
- New "Join the Club" CTA on the homepage hero and in the navbar.
- Signup → Stripe Checkout → return to `/members` with subscription active.

### 3. Members area
- `/members` — landing page showing the library grid of all books with cover, title, and a "Read" button. Locked books show a lock icon for non-subscribers.
- `/members/account` — manage subscription (opens Stripe customer portal), sign out, view trial/renewal date.

### 4. Book reader (the core experience)
- Route: `/read/:bookSlug` (publicly accessible but page access gated).
- Full-screen, kid-friendly viewer: large page image, big Previous/Next arrows, page counter, "Back to Library" button.
- **Read Aloud** button using the browser's free SpeechSynthesis API (same approach already working on the Easter Story page) — Play/Pause/Stop, auto-advance to next page on completion (toggleable).
- Controls: font size for narration caption, voice selector, speed slider.
- **Preview mode**: non-subscribers can view pages 1–3 of any book; page 4 shows a "Subscribe to keep reading" paywall card with the Join button.
- Mobile-friendly with swipe gestures for page turn.

### 5. Homepage + navigation updates
- Add a "Join Maggie's Reading Club" hero card with pricing and 7-day free trial badge.
- Add "Members" link to the navbar (shows "Sign In" when logged out, "My Library" when logged in).
- Keep the existing free Easter Story / Bible Heroes prominent — they remain the free funnel.

## Out of scope for this pass
- Uploading actual book pages — the reader will work with a single seeded sample book so you can verify the flow end-to-end. Once approved, you'll upload page images per book in follow-up turns.
- Member-only videos, annual gift cards, family plans — easy to add later on the same foundation.
- Higher-quality AI narration (Lovable AI text-to-speech) — browser voices are free and good enough to launch; we can upgrade selectively later.

## Technical notes
- HashRouter and `base: './'` are already in place for Hostinger deploys; all new routes use `<Link>` and the hash format.
- Stripe webhook URL will be a Lovable Cloud edge function endpoint — given to you once Stripe is enabled so you can paste it into the Stripe dashboard for live mode (test mode is automatic).
- Book page images will be stored in Lovable Cloud Storage (private bucket); signed URLs issued only to active subscribers.
- Subscription status is checked on every reader page load via the `check-subscription` edge function (cached briefly client-side).

## Suggested follow-up after this plan ships
1. Upload pages for your first 2–3 books and validate the reader UX with a real child.
2. Add an email welcome sequence (signup confirmation, day-3 trial reminder, day-6 conversion nudge).
3. Promote: homepage banner, Pinterest pins targeting "Bible stories for kids online", a free chapter download in exchange for email, and a member-exclusive new-book announcement cadence.
