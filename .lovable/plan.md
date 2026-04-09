

## Plan: Open Online Books in a New Tab

Since the Online Books page is a standalone HTML file hosted at `booksbymaggie.com/heroes`, the simplest solution is to open it in a new browser tab. Users can close that tab to return. No modification to the standalone `index.html` is needed at all.

### What changes

**File: `src/components/Navigation.tsx`**

The "Online Books" nav link already has `isExternal: true`, which renders it as an `<a>` tag with `target="_blank"`. Looking at the current code, the desktop external link rendering already uses `target="_blank"` and `rel="noopener noreferrer"`, and the mobile menu does the same. So this should already be working.

I will verify the current behavior is correct and ensure nothing is broken. If the link is already opening in a new tab, no code changes are needed -- the user simply closes the tab to return.

### Summary

- No changes to the standalone `heroes/index.html` file
- The existing nav link already opens in a new tab (`target="_blank"`)
- Users close the tab to return to the main site
- No back button or snippet needed

