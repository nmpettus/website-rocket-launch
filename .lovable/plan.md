# Reading Points System

## Refunds: revised approach

You're right — the earlier "no refunds, points just expire" answer dodged the question. Here is a concrete policy that is fair and easy to explain.

**The rule, in one sentence: your subscription buys points, and if you cancel we buy back the points you never used at the same price you paid for them.**

Every plan has a plain per-point price:

| Plan | Price | Points | Price per point |
|---|---|---|---|
| Monthly | $4.99 | 6 | $0.83 |
| Yearly | $49.00 | 72 | $0.68 |

Refund = **unused points x price per point**. Nothing else enters the math — no partial-month proration, no calendar counting.

Worked examples:

- Yearly member, used 20 of 72 points, cancels. 52 unused x $0.68 = **$35.36 refunded**. They keep the 20 books they unlocked.
- Monthly member, used 4 of 6 points, cancels. 2 unused x $0.83 = **$1.66 refunded**.
- Monthly member, used all 6 points, cancels. **$0 refunded** — they received everything they paid for.

This directly answers your fairness concern: a subscriber who downloaded content has spent that part of their subscription, and those points are simply not refundable. Only untouched points come back.

### Why this is better than time-based proration

- It's understandable. "You get money back for the points you didn't use" needs no explanation. "You get 4/12 of your year back, minus usage" invites arguments.
- It can't be gamed. Someone who unlocks 20 books in week one and cancels gets refunded only for the 52 points they left on the table.
- It's a single number the member can verify themselves on their points page before they cancel.

### Rules that make it work

- **Points are granted up front for the term you paid for.** Monthly = 6 on each renewal. Yearly = all 72 at signup. (With buy-back refunds, up-front granting is now safe — that's what changed from my earlier suggestion of dripping the yearly points.)
- **Refunds only cover the current paid term.** Unused points from earlier renewals roll over for reading but are not refundable — you can only be refunded money you actually paid this term.
- **Trial cancellations refund nothing** because nothing was charged, and any trial points simply stop working.
- **Unlocks are permanent.** A point spent buys that title forever, even after cancellation. That's why the spend is non-refundable.
- **Refunds are approved by you, not automatic.** Cancelling shows the member their exact refundable amount and files a request; you approve it from the admin panel, and the money is returned through the payment provider. This keeps you in control and avoids automated payouts on suspicious accounts.

### Customer-facing wording

> Your plan gives you points to unlock books, stories, downloads and coloring books. Points you spend are yours to keep — those books stay in your library forever. If you cancel, we refund the points you haven't spent yet, at the same price you paid for them.

## Point costs

| Content type | Cost |
|---|---|
| Full picture book | 3 points |
| Downloadable PDF / printable pack | 2 points |
| Coloring book | 2 points |
| Short story | 1 point |

Monthly (6 points) = about 2 books a month. Yearly (72 points) = about 24 books. Free books cost 0 points. Admins bypass costs entirely.

## What gets built

### 1. Content typing and pricing
Add `content_type` to books (`picture_book`, `short_story`, `coloring_book`, `download`) and a `point_cost` column so any title's cost can be overridden from the admin panel. Existing books default to `picture_book` / 3 points; free books get 0.

### 2. Points ledger
Balances come from an append-only ledger of grants, spends, refunds and expirations, so every point is traceable and disputes are easy to settle. Grants are written by the billing webhook on each renewal, keyed by invoice ID so a replayed webhook can't double-grant.

### 3. Unlocks
An `unlocks` table records permanent ownership. The reader checks: free book, or admin, or unlocked — full access; otherwise the existing 3-page preview plus an "Unlock for N points" prompt.

### 4. Refund requests
Cancelling shows a summary — points granted this term, points spent, refundable amount — and creates a refund request. The admin panel lists pending requests with the computed amount; approving issues the refund through the payment provider and writes a ledger row that zeroes the member's remaining term points so they can't be spent after being cashed out.

### 5. Member-facing UI
- Points balance chip in the Members header and reader header.
- Unlock confirmation dialog showing cost and remaining balance.
- "Not enough points" state offering the yearly upgrade.
- "Points & History" panel listing every grant, spend and refund.
- Point cost badge on each book card.

### 6. Admin
- Set content type and point cost per book in Admin → Books.
- Members tab shows each member's balance, with a manual grant/adjust action logged with a reason.
- Refund requests queue with approve/decline.

## Technical notes

- New tables: `unlocks` (user_id, book_id, unique), `point_ledger` (user_id, delta, reason, source_ref, term_ref, environment, created_at), `refund_requests` (user_id, subscription_id, unused_points, amount_cents, status). All RLS-scoped to `auth.uid()` with admin read via `has_role`, plus required GRANTs.
- Spending goes through a `security definer` function `spend_points(book_id)` that atomically checks balance, writes the spend row and the unlock row. No client INSERT policy on `point_ledger`.
- `get_point_balance(user_id)` and `get_refundable_points(user_id)` give the UI, the reader and the admin panel one shared source of truth.
- Per-point price derives from the plan's `price_id` (`reading_club_monthly` / `reading_club_yearly`) so it stays correct across sandbox and live.
- Refund execution: a new edge function calls the payment provider's refund API for the computed amount against the latest invoice, admin-guarded the same way the existing Stripe functions are.
- Reader gating in `src/pages/BookReader.tsx` extends the existing `gated` check with an unlock lookup; the paywall test is extended to cover unlocked vs. locked.
- All point and refund reads filter by `environment` so sandbox testing can't hand out live points or real money.
