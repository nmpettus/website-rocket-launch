

# Maggie's Easter Story - Free PDF Download

## Overview
Add a free Easter story PDF download with two key elements: an announcement banner at the top of the site and a dedicated detail page for the Easter story.

## What Will Be Built

### 1. Easter Announcement Banner
- Replace or update the current launch banner (LaunchBanner.tsx) to announce the free Easter story
- Easter-themed styling with pastel colors (soft purples, pinks, greens)
- "Free Download" call-to-action linking to the dedicated Easter story page
- Dismissible with the X button (same as current banner behavior)

### 2. Dedicated Easter Story Page
- New page at `/books/easter` following the same layout as other book detail pages (breadcrumbs, cover image, description, FAQs)
- Prominent "Download Free PDF" button that triggers the PDF download
- Easter-themed styling and description
- A "FREE" badge instead of price/purchase buttons
- No Amazon/Kindle links since this is a free download

### 3. Easter Story in the Bookshelf
- Add the Easter story to the books data in `bookReviews.ts` so it appears in the bookshelf grid
- Marked with a "Free" badge to distinguish it from paid books
- "View Details" links to the dedicated page

---

## Technical Details

### New Files
- `src/pages/books/EasterBook.tsx` - Dedicated detail page with PDF download button

### Modified Files
- `src/components/LaunchBanner.tsx` - Update to announce the Easter story with Easter-themed colors and link to `/books/easter`
- `src/data/bookReviews.ts` - Add Easter story entry to `booksData` array with a `isFree: true` flag and empty `amazonLink`/`kindleLink`
- `src/data/seoData.ts` - Add SEO data for the Easter book page
- `src/App.tsx` - Add route for `/books/easter` (using HashRouter as per project conventions)
- `src/components/books/BookCard.tsx` - Handle `isFree` flag: show "Free Download" badge and replace Amazon/Kindle buttons with a download button when the book is free

### PDF Hosting
- The uploaded PDF will be placed in the `public/` folder (e.g., `public/books/easter-story.pdf`)
- Download button will link directly to the PDF file

### Book Card Changes for Free Books
- Show a "Free" badge (green) in the top-left corner
- Replace the Amazon/Kindle purchase buttons with a single "Download Free PDF" button
- Keep the "View Details" button linking to the detail page

