## Fix: Members page not updating after checkout

**Problem:** After returning from Stripe checkout to `/members?checkout=success`, the page still shows "You're not subscribed yet" until the user manually refreshes. The webhook fires and writes the row correctly, but there's a race between redirect and Supabase realtime propagation.

**Fix in `src/pages/Members.tsx`:**

1. Read `checkout=success` from the URL (via `useSearchParams`).
2. When present:
   - Show a toast: "Subscription activated!"
   - Poll `refetch()` from `useSubscription` every ~1.5s (up to ~15s) until `isActive` becomes true, then stop.
   - Strip the `checkout` query param from the URL so a manual refresh doesn't retrigger.
3. No changes to webhook, edge functions, or DB schema — those are verified working.

**Why polling instead of one refetch:** The webhook typically writes within 1–3s of redirect, but can occasionally take longer. Realtime subscription in `useSubscription` should also catch it, but polling ensures the banner flips even if the realtime channel hasn't attached yet on a fresh page load.

**Scope:** UI/presentation change only in `Members.tsx`.