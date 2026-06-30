## Plan: Verify complete Stripe subscription checkout works end-to-end

### What I'll check (read-only / verification only — no code changes unless something is broken)

**1. Configuration audit (already partially done)**
- ✅ `supabase/config.toml` has `verify_jwt = false` for all 4 payment functions
- ✅ `_shared/stripe.ts` uses connector gateway (`createStripeClient`), correct API version `2026-03-25.dahlia`, includes `verifyWebhook`
- ✅ `create-checkout` uses `ui_mode: "embedded_page"`, resolves customer via `resolveOrCreateCustomer`, attaches `userId` to Session + Subscription + Customer, sets 7-day trial
- ✅ `payments-webhook` handles `customer.subscription.created/updated/deleted`, gates on `?env=`, uses `lookup_key` precedence
- ✅ `useSubscription` filters by env, orders by `created_at desc`, treats `canceled` with future period_end as active
- ✅ `Join.tsx` shows status banner, short-circuits if already active, renders `<EmbeddedCheckout />` inline
- ✅ `publicConfig.ts` reads `VITE_PAYMENTS_CLIENT_TOKEN`; `getStripeEnvironment()` throws if missing instead of defaulting to live
- ✅ All required secrets present: `STRIPE_SANDBOX_API_KEY`, `STRIPE_LIVE_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, `PAYMENTS_LIVE_WEBHOOK_SECRET`, `LOVABLE_API_KEY`

**2. Verify products & prices exist in Stripe**

The most recent `create-checkout` log shows: `Error: Price not found at index.ts:65:36`. That means `stripe.prices.list({ lookup_keys: [priceId] })` returned 0 rows for `reading_club_monthly` or `reading_club_yearly` at the time of that call. I'll:
- Call `payments--get_go_live_status` to confirm sandbox/live state.
- Invoke `create-checkout` from a curl test with `reading_club_monthly` to confirm whether the lookup keys now resolve or still 400. If they don't resolve, recreate the two prices with `payments--create_product` (monthly) + `payments--create_price` (yearly).

**3. End-to-end Playwright test of the actual card-entry flow**

This is the real verification — drive a real browser through the flow and screenshot the Stripe iframe with the card form mounted:

1. Create a brand-new throwaway account via `supabase--insert` into `auth.users` is not available; instead, use the **sign-up form** at `/#/auth` with a unique random email (no existing subscription).
2. Navigate to `/#/join`.
3. Click **Start Free Trial** on the monthly plan.
4. Wait for the embedded Stripe iframe (`iframe[name^="__privateStripeFrame"]`) to mount, screenshot the page so you can see the card-entry form rendered inline.
5. Fill in the iframe with test card `4242 4242 4242 4242`, future expiry, any CVC, ZIP `12345`.
6. Submit the form.
7. Wait for redirect to `/#/members?checkout=success`.
8. Screenshot the Members page showing the now-active subscription.
9. Query `subscriptions` table via `supabase--read_query` to confirm the webhook fired and inserted the row with `environment='sandbox'`, `status='trialing'`, correct `user_id`, correct `price_id='reading_club_monthly'`.

**4. Verify cancellation path**

After confirming the subscription is active in the DB:
- From the Playwright session, click **Cancel Subscription** on `/#/members`, confirm the AlertDialog, and verify the row updates with `cancel_at_period_end=true` via `supabase--read_query`.

**5. Report**

Produce a checklist:
- [ ] Products/prices exist
- [ ] `create-checkout` returns valid `clientSecret`
- [ ] Embedded card form mounts (screenshot)
- [ ] Card submission completes
- [ ] Return URL drops user at `/#/members?checkout=success`
- [ ] Webhook wrote `subscriptions` row with correct env, status, user_id, price_id
- [ ] `useSubscription` flips `isActive=true`
- [ ] Cancel button schedules cancellation (`cancel_at_period_end=true`)

If any step fails, I'll fix the root cause and re-run that step. I will NOT mark anything green without a screenshot or DB query proving it.

### Constraints

- Don't touch live mode — sandbox only (the preview uses `pk_test_`).
- Don't reuse your real account; create a throwaway with a random email like `qa-stripe-<timestamp>@example.com` so we actually see the card form.
- Won't modify any production code unless verification surfaces a real bug (most likely candidate: missing prices, in which case I'll create them via `payments--create_product` / `payments--create_price`).