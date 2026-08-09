# Turn Stripe Test Mode Off

## Goal
Make the production site run in live Stripe mode by default and ensure test mode is not accidentally active.

## Current State
- Go-live is complete and live Stripe API keys are provisioned.
- An admin toggle (`AdminStripeModeToggle`) lets admins switch between live and test mode; it stores the choice in `localStorage` under `admin_stripe_test_mode`.
- The default state is already "off" (live), but a previously set `localStorage` value can keep the site in test mode.
- `PaymentTestModeBanner` shows the orange test banner whenever the active Stripe environment is `sandbox`.

## Plan

1. **Reset persisted test-mode preference**
   - Update `src/lib/stripe.ts` so `getAdminTestModeEnabled` returns `false` and clears any stale `admin_stripe_test_mode` value from `localStorage` on first read.
   - Keep the helper functions so the admin toggle still works, but the default/startup state is definitively live.

2. **Default the admin toggle UI to OFF**
   - In `src/components/AdminStripeModeToggle.tsx`, initialize the switch state to `false` and only reflect the stored value after explicitly reading it.
   - Ensure the label reads "Admin: Stripe test mode" and shows `LIVE` when off.

3. **Verify live environment is active**
   - In `src/lib/stripe.ts`, confirm `buildTokenFromEnv` falls back to the production `stripeClientToken` when test mode is off.
   - Confirm `getStripeEnvironment()` returns `live` when the production token starts with `pk_live_`.

4. **Add a live-mode confirmation indicator**
   - Optionally update `PaymentTestModeBanner.tsx` to show a subtle green "Live payments" indicator when in live mode, so it is obvious test mode is off.

5. **Test the change**
   - Build the project and confirm no TypeScript errors.
   - Verify the test banner is gone and the admin toggle shows `LIVE` by default.

## Outcome
The site will start in live Stripe mode, the orange test banner will disappear for regular users, and admins will still be able to enable test mode from the toggle when needed.
