

## Plan: Show Only Right Side of AI Adventures Cover in Online Library

The AI Adventures cover image (`maggie-ai-cover-latest.jpg`) is a wide/landscape image. The user wants only the right-hand portion displayed in the Online Library grid card.

### Approach

**File: `src/pages/OnlineLibrary.tsx`**

Add a conditional CSS class for the `ai-adventures` book card image. Instead of `object-cover` (which centers), use `object-right` so the right side of the image is shown when cropped into the 3:4 aspect ratio container.

Change on line 73: add a conditional class check — when `book.id === "ai-adventures"`, apply `object-right` instead of the default centered `object-cover`.

This is a one-line CSS change, no new files or complex logic needed.

