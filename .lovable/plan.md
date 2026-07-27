## Goal
Ship the app in **live mode** for all users, while allowing **admins** to flip a toggle into **test mode** for their own session (so they can run test-card checkouts without touching the live account).

## Approach

Ship the test publishable key in code as a constant (publishable keys are safe to expose). The site defaults to the live key. Admins get a UI toggle that stores an override in `localStorage`, which the Stripe helpers read at runtime.

### 1. `src/lib/publicConfig.ts`
- Add exported constant `STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_51TmZCn..."` (the key you pasted).
- Keep `stripeClientToken` as the build-time env value (this becomes the live token in prod).

### 2. `src/lib/stripe.ts` (rewrite of environment resolution)
- Add helper `getAdminTestModeEnabled()` reading `localStorage.getItem("admin_stripe_test_mode") === "true"`.
- Add setter `setAdminTestModeEnabled(bool)` that writes localStorage and resets the cached `stripePromise` so `loadStripe` re-initializes.
- `getStripeEnvironment()`: return `'sandbox'` when admin override is on, else derive from `stripeClientToken` prefix (existing logic).
- `getStripe()`: when override is on, `loadStripe(STRIPE_TEST_PUBLISHABLE_KEY)`; otherwise use `stripeClientToken`.

### 3. Admin toggle UI — new `src/components/AdminStripeModeToggle.tsx`
- Uses `useIsAdmin()`; renders nothing for non-admins.
- Small pill/switch fixed near the test-mode banner area (or inside Members admin section — see question below).
- Toggling calls `setAdminTestModeEnabled` and reloads the page so `useSubscription`, checkout, and portal all re-read env consistently.

### 4. `src/components/PaymentTestModeBanner.tsx`
- Continue showing the orange "Test mode" banner whenever `getStripeEnvironment() === 'sandbox'` (now also true for admins who flipped the switch), so admins have a clear visual reminder they're in test mode.
- Remove the "production not configured" red state (no longer possible — live key is present in prod build).

### 5. No backend changes required
`create-checkout`, `create-portal-session`, `cancel-subscription`, and `payments-webhook` already accept `environment: 'sandbox' | 'live'` from the client / webhook query. Because `useSubscription` and every server call read `getStripeEnvironment()`, an admin in test mode will:
- create checkout sessions against `STRIPE_SANDBOX_API_KEY`
- read from `subscriptions` rows where `environment = 'sandbox'`
- receive webhooks on the sandbox secret (already wired)

Regular users never see the toggle and always run against live.

## Where the toggle lives — need your input

**Question:** Where should the admin test-mode switch appear?
- **A.** Inside the existing Members/Admin area only (cleanest, out of the way).
- **B.** A small floating pill in the corner on every page (fastest to reach while testing checkout on `/join`).
- **C.** Both — pill visible on `/join` and `/members` only.

My recommendation: **C** — you're most likely to want it exactly when testing subscribe/portal flows.

## Files touched
- `src/lib/publicConfig.ts` (add test key constant)
- `src/lib/stripe.ts` (admin override logic)
- `src/components/PaymentTestModeBanner.tsx` (simplify)
- `src/components/AdminStripeModeToggle.tsx` (new)
- `src/pages/Join.tsx` + `src/pages/Members.tsx` (mount the toggle per chosen option)
