
# Fix "Suggest a Video" Buttons

## Problem
The "Suggest a Video" buttons on both the Videos page (`/videos`) and the homepage Videos section try to scroll to a `#contact` element, but when you're on the `/videos` page, the contact section doesn't exist on that page -- so nothing happens.

## Solution
Replace the `scrollIntoView` approach with a `mailto:` link to `maggie@booksbymaggie.com` (the existing contact email) with a pre-filled subject line like "Video Suggestion for Maggie". This works from any page without needing the contact section to be present.

## Changes

### 1. `src/pages/Videos.tsx` (line ~188-194)
- Replace the `onClick` scroll handler with an `<a href="mailto:maggie@booksbymaggie.com?subject=Video Suggestion for Maggie">` link styled as a button, or wrap the Button in a link.

### 2. `src/components/sections/Videos.tsx` (line ~89-94)
- Same change: replace the `onClick` scroll handler with the `mailto:` link approach for consistency.

Both buttons will open the user's email client with a pre-filled subject, tying into the existing email infrastructure.
