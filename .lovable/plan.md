Add a conditional "Admin" link to the app navigation that routes to `/#/admin/books`, visible only when the logged-in user has the `admin` role.

## What to build

1. **Update `src/components/Navigation.tsx`**:
   - Import `useIsAdmin` from `@/hooks/useIsAdmin`.
   - Call `useIsAdmin()` inside the `Navigation` component.
   - In the **desktop nav bar** (`hidden lg:flex`), after the existing links, conditionally render a `<Link>` to `/admin/books` with label "Admin" when `isAdmin` is true.
   - In the **mobile menu** (`lg:hidden` Sheet), after the existing `NAV_LINKS` loop, conditionally render the same admin link when `isAdmin` is true.
   - Style the admin link the same as other route links (using the existing `isActiveLink` logic for active-state highlighting).

## Files changed
- `src/components/Navigation.tsx`

## No database or routing changes required
The `/admin/books` route already exists in `App.tsx`. The `useIsAdmin` hook and `user_roles` table already exist.