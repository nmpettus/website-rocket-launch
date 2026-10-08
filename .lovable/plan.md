# Add a "Spread Matching" slider to reader Options

## Goal
In the reader's Options popup, add a slider that controls how closely two page edges must match before Auto shows them as a two-page spread.

## What you'll see
- New slider under Page Layout: **Spread Matching**, from "Strict" to "Relaxed", with the current setting in the middle (5 of 1–10).
- Moving toward Relaxed shows more pages as spreads; toward Strict, only very close matches pair up.
- Changes apply right away to the book you're reading. The setting is remembered on that browser.
- Only affects Auto. Single and Two-Page still override it. Blank/white edges never count as a match.
- Reset to Defaults puts it back in the middle.

## Technical details
- `src/pages/BookReader.tsx`: change `edgesMatch(a, b, level)` so the cutoffs scale with level: middle = corr >= 0.80 / median <= 25 (today's values); Strict end ≈ 0.92 / 12; Relaxed end ≈ 0.60 / 45.
- Store the level in state + localStorage; include it in the `pairMemo` key and clear `pairs` when it changes so pages re-evaluate from cached edge samples (no re-download).
- Add level to Reset to Defaults.
- Update `BookReader.spread.test.ts`: default level keeps current behavior; a borderline pair matches at Relaxed but not at Strict.
