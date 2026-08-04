# Reading Points System

## My honest opinion first

A points system is a good fit for a mixed catalog (full books, downloadables, short stories, coloring books), but two parts of the idea need adjusting:

1. **Don't tie points to cash refunds.** Refunding "the unused portion" of a subscription turns points into stored value, which creates real accounting and tax headaches and invites abuse (subscribe, read 6 books, cancel, demand a refund). It also can't be automated cleanly through the billing provider.

   Recommended instead: points are **access credits, not money**. On cancellation the member keeps their remaining points until the end of the period they already paid for, then the points expire. That is simple, fair-feeling, and needs no refund logic.

2. **Once a member spends a point on a book, that book should stay unlocked forever** (as long as their account exists). Charging again on re-read makes the system feel punitive to a children's-book audience where re-reading is the whole point. Points buy permanent unlocks, not views.

### Recommended point values

| Content type | Cost |
|---|---|
| Full picture book | 3 points |
| Downloadable PDF / printable pack | 2 points |
| Coloring book | 2 points |
| Short story | 1 point |

With this scale, monthly (6 points) = about 2 books a month, yearly (72 points) = about 24 books. Free books stay free and cost 0 points.

### Other recommendations

- **Yearly grants monthly, not all at once.** Granting all 72 up front means a yearly member can drain the whole library in week one and cancel. Grant 6 points per month for 12 months (with rollover), and headline it as "72 points a year."
- **Rollover with a cap** (e.g. max 24 banked points) so points feel valuable without unlimited hoarding.
- **Free/trial members** get the current 3-page preview plus 1 welcome point so they can unlock one short story.
- **Admins** bypass point costs entirely.

## What gets built

### 1. Content typing and pricing
Add a `content_type` to books (`picture_book`, `short_story`, `coloring_book`, `download`) and a `point_cost` column so you can override the default cost per title from the admin panel. Existing books default to `picture_book` / 3 points; `is_free` books get 0.

### 2. Points ledger
A points balance is derived from an append-only ledger of grants, spends, and expirations. This keeps a clear history ("where did my points go?") and makes disputes easy to resolve.

- Monthly grants issued when the billing webhook reports a renewal, plus a catch-up grant so a lapse can't silently skip a month.
- Spends recorded when a member unlocks a title.
- Expirations written when a canceled subscription's paid period ends.

### 3. Unlocks
An `unlocks` table records which member owns which title permanently. The reader checks: free book, or admin, or unlocked → full access; otherwise 3-page preview with an "Unlock for N points" prompt.

### 4. Member-facing UI
- Points balance chip in the Members header and reader header.
- Unlock confirmation dialog showing cost and remaining balance.
- "Not enough points" state offering the yearly upgrade.
- A "Points & History" panel in the Members subscription tab listing grants and spends.
- Point cost badge on each book card in the library.

### 5. Admin
- Set content type and point cost per book in Admin → Books.
- Members tab shows balance, with a manual grant/adjust action (logged in the ledger with a reason).

## Technical notes

- New tables: `book_entitlements`-style `unlocks` (user_id, book_id, unique) and `point_ledger` (user_id, delta, reason, source, environment, created_at). Both RLS-scoped to `auth.uid()`, with admin read via `has_role`, plus the required GRANTs.
- Spending goes through a `security definer` function `spend_points(book_id)` that atomically checks balance, writes the spend row and the unlock row. Clients never write to the ledger directly — no INSERT policy for `authenticated` on `point_ledger`.
- Balance read through a `get_point_balance(user_id)` function so the reader and UI share one source of truth.
- Monthly grants handled in `payments-webhook` on `invoice.paid`, keyed by invoice ID so a replayed webhook can't double-grant.
- Reader gating in `src/pages/BookReader.tsx` extends the existing `gated` check with an unlock lookup; the existing paywall test is extended to cover unlocked vs. locked.
- All point reads filter by `environment` so sandbox testing can't hand out live points.

## Open questions

- Are the suggested point costs (3 / 2 / 2 / 1) right, or do you want different values?
- Should yearly members get all 72 points up front despite the risk, or the monthly drip I recommend?
