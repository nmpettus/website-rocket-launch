# Make Auto show matching pages as a two-page spread

## Goal
In Auto, when the right edge of one page continues into the left edge of the next page (one illustration split across two pages), the reader shows both pages side by side. Pages whose edges don't match stay single.

## Current behavior
Auto already compares the touching edges, but its test is very strict: on average the colors must be 95% alike, and 90% of the rows along the edge must almost exactly match. Small differences that real split illustrations always have (a slight trim offset, compression, a thin gutter) make true spreads fail, so they show as single pages. The exact reason for the book you're viewing isn't confirmed yet, so step 1 checks that first.

## Steps
1. **Check real pages first.** Run the edge test on the book you're reading against pages you know are spreads and pages that aren't. Record the scores, and make sure the image check isn't failing without an error (for example, if the browser refuses to read the image's pixels).
2. **Make the edge match more forgiving but still accurate:**
   - Sample the innermost pixel columns at both edges, not a strip that reaches into the page.
   - Allow a small up/down offset (a few rows) and keep the best fit.
   - Score the match by how well the edges follow the same shapes and color changes, not only by exact color, so slight brightness or compression differences still count.
   - Set the cutoff from the real scores in step 1, so true spreads pass and unrelated pages don't.
   - Keep the rule that plain white or empty edges never count as a match.
3. **Check pairs on either side.** If one page doesn't pair with the next, also check whether it pairs with the page before, so spreads aren't missed when the page count is shifted by one.
4. **Clear old results.** Throw away saved spread decisions from the old test so books are checked again.
5. **Verify.** Open the book in the reader with Auto on: matching pairs show as spreads, other pages stay single, and Single/Two-Page still override Auto.

## Technical details
- File: `src/pages/BookReader.tsx` (`samplePage`, `computePairFromCache`, `canAutoPairAt`, `pairMemo`).
- Edge strip: 1–2 px instead of 0.8% of width. Use 192 rows. Compare luminance gradient correlation plus a median color distance, with a ±3 row shift search.
- Version the `pairMemo` key (for example a `v2|` prefix) so stale results are skipped.
- Log `getImageData` failures to the console instead of ignoring them silently.
- No changes to the backend, layout controls, or defaults.
