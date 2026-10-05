# Make the signed-in state visible, and easy to sign out

## What is happening
Yes. The site remembers the login on this browser, which is standard and intended. The sign-in records show maggie@booksbymaggie.com signed in at 12:03 today, so after a reload she is still signed in. That's why Admin appears. Admin only shows for accounts that have the admin role, and that check happens on the server. Other visitors never see it.

The navbar currently has no way to see who is signed in, and no Sign Out button. That makes it look like Admin is showing on its own.

## Changes
1. **Account control in the navbar (desktop and mobile menu)**
   - Signed out: show a "Sign In" link.
   - Signed in: show a small menu with "Signed in as maggie@…", "My Library", and "Sign Out".
2. **Sign Out** ends the session, then returns to the home page. Admin disappears right away.
3. Admin stays hidden for everyone except admin accounts. Nothing else changes.

## Technical details
- `src/components/Navigation.tsx`: use `useAuth()` (`user`, `signOut`), plus a shadcn DropdownMenu on desktop and items in the mobile Sheet. On sign out, call `navigate("/")`.
- On sign out, reset `useIsAdmin` state (it already reacts to `user` becoming null).
- The session stays remembered (default auth persistence). Turning off "remember me" can come later if wanted.
