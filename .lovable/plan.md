## Ocean Explorer Magazine — homepage redesign

### 1. Design tokens (`src/index.css`)
Update the active "ocean" theme to the chosen palette:
- deep navy `#001219` (background)
- surface `#002b3d` (cards)
- teal `#0a9396` (primary)
- seafoam `#94d2bd` (secondary/accent)
- amber `#ee9b00` (highlight / badges / CTA)

All values written as HSL semantic tokens. Add utilities for dark magazine cards (surface, border, elevated shadow).

### 2. Typography
- Load **Syne** (headings) and **Plus Jakarta Sans** (body) via Google Fonts.
- Update `tailwind.config.ts` font families to map `font-heading` / `font-sans`.

### 3. Homepage hero (`src/components/sections/Hero.tsx`)
Rebuild as an editorial magazine block:
- Dark magazine card container, two-column layout
- Oversized Syne headline, amber badge above it
- Teal primary CTA + seafoam secondary CTA (keeping the existing subscription-check modal behavior intact)
- Circular Maggie "porthole" image with rotating accent border
- Floating Reading Club card and chat bubble
- Editorial stats row along the bottom

### 4. Navigation (`src/components/Navigation.tsx`)
Adjust for the dark theme: light text, frosted/translucent nav bar, amber active state. No changes to menu logic or the Reading Club modal.

### 5. Global background & contrast pass
Set page background to deep navy and review the other homepage sections (books, about, footer) so text and buttons keep readable contrast against the new palette.

### 6. Verification
Type check, build, and preview the homepage at desktop and mobile widths.

### Out of scope
No backend, auth, payments, book reader, admin, `books`, `book_pages`, or storage changes. Other pages are checked for contrast only, not redesigned.

### Notes
- Purely presentational; fully revertible via version history.
- Hostinger constraints preserved (HashRouter, `base: './'`, `.htaccess`) — you'll rebuild and redeploy manually.
