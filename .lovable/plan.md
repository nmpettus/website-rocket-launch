## Plan

1. **Correct the preview page rule**
   - Update the backend page-access rule so non-subscribers can read pages **1, 2, and 3**, not pages 4–6.
   - Keep free books fully readable.
   - Keep active subscribers fully readable.

2. **Harden the reader UI**
   - Make `BookReader` use the already-computed preview list for display/navigation so an unsubscribed user cannot render page 4 even if the backend returns extra rows.
   - If a non-subscriber lands on or is restored to a page past page 3, automatically clamp them back to page 3 and show the paywall.
   - Ensure image preloading/offline caching only targets the allowed preview pages for non-subscribers.

3. **Update the existing paywall test**
   - Add coverage for the regression where the backend returns pages starting at 4.
   - Verify an unsubscribed user sees only pages 1–3 and cannot advance past page 3.

## Technical notes

- The current access policy contains `page_number = ANY (ARRAY[4, 5, 6])`, which matches the reported behavior.
- The UI also calculates `visiblePagesArr` but still renders from the full `pages` array, so it needs to consistently render from the gated page list.