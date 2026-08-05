# Reading Credits System

## The policy

Members get a monthly allowance of credits and spend them to unlock content. Credits do **not** roll over — each month starts fresh.

| Plan | Price | Credits per month |
|---|---|---|
| Monthly | $4.99 | 7 |
| Yearly | $49.00 | 12 (10 + 2 bonus) |

**Monthly cancellation:** the plan stays active until the end of the paid month, then stops with no further billing. No refund. Any credits left at the end of that month are lost.

**Yearly cancellation:** access continues to the end of the current month, then the remaining whole months are refunded at $49 / 12 = $4.09 per month. Credits left at the end of that month are lost.

Worked examples:

- Yearly member cancels in month 5. They finish month 5, then 7 full months remain: 7 x $4.09 = **$28.58 refunded**.
- Monthly member cancels mid-month. They read to the end of the month, are not billed again, **$0 refunded**.

**Unlocks are permanent.** A credit spent buys that title forever, even after the subscription ends. That is what makes lost credits fair — you keep everything you actually unlocked.

### Customer-facing wording

> Your plan gives you credits each month to unlock books, stories, downloads and coloring books. Anything you unlock is yours to keep forever. Credits reset each month and don't carry over. Cancel anytime — monthly plans simply stop at the end of the month, and yearly plans are refunded for the full months you haven't used.

## Credit costs

| Content type | Cost |
|---|---|
| Full picture book | 3 credits |
| Downloadable PDF / printable pack | 2 credits |
| Coloring book | 2 credits |
| Short story | 1 credit |

Monthly (7/month) = about 2 books. Yearly (12/month) = about 4 books. Free books cost 0. Admins bypass costs.

## What gets built

### 1. Content typing and pricing
Add `content_type` to books (`picture_book`, `short_story`, `coloring_book`, `download`) and a `credit_cost` column so any title's cost can be overridden from the admin panel. Existing books default to `picture_book` / 3 credits; free books get 0.

### 2. Credit ledger
Balances come from an append-only ledger of grants, spends and expirations, so every credit is traceable. Each monthly period gets one grant row keyed to the period, so a replayed billing webhook can't double-grant. Yearly members are granted 12 credits at the start of each month of their term, not 144 up front.

### 3. Monthly reset
Balance is always "credits granted for the current month minus credits spent this month" — expiry is implicit, so no scheduled job is needed. The ledger keeps history for the member's activity list.

### 4. Unlocks
An `unlocks` table records permanent ownership. The reader checks: free book, or admin, or unlocked — full access; otherwise the existing 3-page preview plus an "Unlock for N credits" prompt.

### 5. Cancellation and refunds
The cancel flow shows exactly what happens for the member's plan: monthly sees "access until <date>, no further billing"; yearly sees the computed refund (`whole months remaining x $4.09`) and files a refund request. The admin panel lists pending requests with the computed amount; approving issues the refund through the payment provider.

### 6. Member-facing UI
- Credit balance chip in the Members header and reader header, with "resets on <date>".
- Unlock confirmation dialog showing cost and remaining balance.
- "Not enough credits" state offering the yearly upgrade.
- "Credits & History" panel listing grants, spends and unlocks.
- Credit cost badge on each book card.

### 7. Admin
- Set content type and credit cost per book in Admin → Books.
- Members tab shows each member's balance, with a manual grant/adjust action logged with a reason.
- Refund requests queue with approve/decline.

## Technical notes

- New tables: `unlocks` (user_id, book_id, unique), `credit_ledger` (user_id, delta, reason, source_ref, period_start, environment, created_at), `refund_requests` (user_id, subscription_id, months_remaining, amount_cents, status). All RLS-scoped to `auth.uid()` with admin read via `has_role`, plus required GRANTs.
- Spending goes through a `security definer` function `spend_credits(book_id)` that atomically checks the current-period balance, writes the spend row and the unlock row. No client INSERT policy on `credit_ledger`.
- `get_credit_balance(user_id)` returns the current period's remaining credits and is the single source of truth for UI, reader and admin.
- Monthly allowance derives from the plan's `price_id` (`reading_club_monthly` = 7, `reading_club_yearly` = 12) so it stays correct across sandbox and live.
- Grants are written by the billing webhook: monthly on each `invoice.paid`; yearly needs a monthly tick, handled by granting lazily on first read of a new period (no cron required).
- Refund execution: a new edge function calls the payment provider's refund API for the computed amount, admin-guarded like the existing Stripe functions.
- Reader gating in `src/pages/BookReader.tsx` extends the existing `gated` check with an unlock lookup; the paywall test is extended to cover unlocked vs. locked.
- All credit and refund reads filter by `environment` so sandbox testing can't hand out live credits or real money.
