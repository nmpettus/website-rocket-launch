# Fix "can't sign in" on the account page

## What I found

The account page (`src/pages/Auth.tsx`) always opens in **Create Account** mode, even for people who already have an account. A returning member who types their existing email and password there is sent through signup, and Supabase rejects it (for example "User already registered"), so it looks like sign-in is broken. The user has to notice the small "Sign in" link at the bottom to switch modes.

Two smaller issues on the same page:
- If someone is already signed in and visits the page, nothing redirects them to their library — they just see the form again.
- Error messages come straight from the backend, so they are technical and don't tell the user what to do next.

## Plan

1. **Default to Sign In**
   - Open the page in `signin` mode by default in `src/pages/Auth.tsx`.
   - Keep a clear "New here? Create account" link to switch to signup.
   - Optionally support a `?mode=signup` style entry so the Join page's "Start free trial" button still lands on the signup form.

2. **Make the two modes obvious**
   - Replace the small bottom text link with a two-button toggle at the top of the card (Sign In / Create Account), so it is never ambiguous which one is active.

3. **Friendlier error handling**
   - Map common auth errors to plain language:
     - "User already registered" -> "You already have an account — switching you to sign in." (and auto-switch the form to signin, keeping the email typed)
     - "Invalid login credentials" -> "That email and password don't match. Try again or use Forgot password."
     - "Email not confirmed" -> tell them to check their inbox for the confirmation link.

4. **Redirect signed-in users**
   - If a session already exists when the page loads, send the user straight to `/members`.

5. **Verify**
   - Load the page and confirm it opens on Sign In.
   - Try signing in with a wrong password and confirm the friendly message appears.
   - Try creating an account with an existing email and confirm it switches to sign in instead of showing a raw error.

## Note

If your sign-in is failing with a "wrong password" style message rather than the signup mix-up above, the fix is a password reset instead — tell me the exact message shown and I'll adjust.
