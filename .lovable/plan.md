## Plan: Separate Free Books from Maggie's Bookshelf

### Overview
Remove the free-download books (Easter Story, Bible Heroes) from the main Maggie's Bookshelf grid and add a prominent link directing visitors to the Online Library page where those free books live.

### Changes

**1. Filter free books out of the Bookshelf grid**
- In `src/components/sections/Books.tsx`, filter `booksData` so only non-free (`!isFree`) books render in the grid.
- The Easter and Bible Heroes books remain in the data file; they just won't display in the Bookshelf.

**2. Add "Online Library" link in the Bookshelf section**
- Below the section header text (or near the grid), add a styled link/button that navigates to `/online-library`.
- Uses existing project styling: semantic Tailwind tokens, rounded-full buttons, `Link` component for internal navigation.
- Copy reads something like "Read Free Books Online" with a book/arrow icon.

**3. Optional: Verify Online Library still shows the free books**
- `src/pages/OnlineLibrary.tsx` already filters for `easter` and `bible-heroes`, so no changes needed there.

### Technical Details
- Uses `Link` from `react-router-dom` per project convention.
- No routing or data-model changes.
- No backend changes.
