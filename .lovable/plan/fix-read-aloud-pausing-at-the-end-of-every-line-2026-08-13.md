# Fix read-aloud pausing at the end of every line

## Problem

Narration text for a page (from `narration_text` or OCR) keeps the line breaks of the printed page. Two things then create an unnatural pause at the end of each printed line:

1. The text sent to the voice service still contains those line breaks, and the voice inserts a break at each one.
2. The reader splits text into audio chunks on line breaks as well as punctuation (`/[^.!?\n]+[.!?]?\s*/g` in `splitForTTS`), so a line that ends mid-sentence becomes its own audio clip — and the gap between clips is heard as a pause.

## Fix

Before building audio for a page:

- Normalize the narration text: join lines that are part of the same sentence into one continuous line (collapse a single newline into a space), keep true paragraph breaks (blank line) as sentence-level separators, remove hyphenated word breaks at line ends (e.g. "some-\nthing" -> "something"), and collapse repeated spaces.
- Change chunking so it splits only at sentence-ending punctuation (`.`, `!`, `?`, and closing quotes after them) — never at a bare line break. Keep the existing size cap so chunks stay comfortably short, but let a chunk boundary land only after punctuation.

Result: the voice flows across wrapped lines and pauses only at commas, periods, question marks, and exclamation points, as it would when reading a sentence normally.

## Technical detail

Single file: `src/pages/BookReader.tsx`.

- Add a `normalizeNarration(text)` helper used inside `buildSpeech` (applied to each page's text, and to the joined left+right spread text).
- Rewrite `splitForTTS` to sentence-split on `/[^.!?]+[.!?]*["')\]]*\s*/g` and accumulate into ~160-character chunks at sentence boundaries only.
- Keep spread pages separated by a sentence-safe break so the right page does not run into the left page mid-sentence.
- No backend, audio-cache, or UI changes; the cache key logic stays as it is.
