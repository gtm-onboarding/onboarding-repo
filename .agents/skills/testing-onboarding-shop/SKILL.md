---
name: testing-onboarding-shop
description: How to run and UI-test the Onboarding Shop demo app (React 18 + TS + Vite e-commerce demo) locally, including auth setup, reaching auth-gated pages, and theme/dark-mode verification pitfalls.
---

# Testing the Onboarding Shop demo app

## Running it

```bash
cd <repo root>
npm install          # already covered by the repo blueprint's maintenance step
npm run dev          # Vite dev server on http://localhost:5173
```

No backend, no API keys, and no secrets are required. `VITE_GOOGLE_CLIENT_ID` is
optional — email/password auth works without it. Whether the Google sign-in
button renders with an empty client id has not been verified; do not rely on
the Google flow for testing.

## Devin Secrets Needed

None. The app is fully self-contained and stores all state in `localStorage`.

## Routes

`/`, `/category/:categoryId`, `/product/:productId`, `/cart`, `/checkout`,
`/signin`, `/signup` (see `src/App.tsx`).

## Auth: creating a test user

Auth is entirely client-side in `localStorage` (`src/context/AuthContext.tsx`,
key `onboarding-demo-users`). There are **no seeded accounts**, so signing in
with an arbitrary email will fail. To get an authenticated session, sign **up**
through the UI at `/signup` (name, email, password ≥ 6 chars, confirm password);
sign-up auto-signs you in.

`/checkout` is auth-gated — clicking "Proceed to Checkout" while anonymous
redirects to `/signin?redirect=/checkout`. Create the account first, then add an
item to the cart and proceed.

## localStorage keys

| Key | Purpose |
|---|---|
| `onboarding-demo-users` | registered users array (`src/context/AuthContext.tsx`) |
| `onboarding-demo-session` | current signed-in user |
| `onboarding-demo-cart` | cart items (`src/context/CartContext.tsx`) |
| `onboarding-demo-theme` | `light` \| `dark` theme preference (only once GB-17 / PR #119 lands) |

Reset to a pristine state with `localStorage.clear()` in the console before a
run, then reload. Cart caveat: `CartContext` writes the cart to
`onboarding-demo-cart`, but under the dev server the cart was observed to come
back **empty after a full page reload** (React 18 `StrictMode` double-runs the
effects, and the save-effect writes `[]` before the load-effect's state lands).
Verify current behaviour before reporting cart persistence either way.

## Theming / dark mode: important testing pitfalls

**Applies only to branches containing GB-17 (PR #119); `main` has no dark mode
until that PR merges.**

Theme is a React context (`src/context/ThemeContext.tsx`) that writes
`--color-*` / `--shadow-*` CSS custom properties onto
`document.documentElement`. Components read them either as `var(--color-x)` in
inline styles or via `useTheme().theme.colors.x`.

1. **Light mode proves nothing.** `src/App.css` hard-codes the *light* values in
   `:root`, so the app looks correct in light mode even if the provider never
   runs. Always anchor theme assertions on observing a real **dark** repaint.
2. **Toggle location:** right-most Header button, `aria-label="Switch to dark
   mode"` in light / `"Switch to light mode"` in dark; moon icon in light, sun in
   dark. Click it — do not set the theme via devtools.
3. **Persistence:** the `useState` initializer reads `localStorage`
   synchronously, so a correct implementation repaints dark immediately on
   reload with no light flash. Verify both directions (dark→reload and
   light→reload) so a one-way write can't pass.
4. **Hunt for hardcoded colours.** The most likely dark-mode bugs are inline
   styles that pair a themed background with a literal colour, or theme tokens
   that `darkTheme` forgets to override. Grep for these before testing:
   ```bash
   grep -rn "color: 'white'\|color: '#" src/
   ```
   Then diff `lightTheme` vs `darkTheme` in `src/theme.ts` for keys present in
   light but not overridden in dark. Known offenders found previously (may or
   may not be fixed): `ProductCard`'s "Add to Cart" button
   (`backgroundColor: var(--color-text)` + hardcoded `color: 'white'` → white on
   near-white) and `Toast` (`--color-success` / `--color-error` not overridden in
   `darkTheme` → low-contrast text on the dark success/error surfaces).
5. **Zoom to judge contrast.** Full-page screenshots hide low-contrast text; use
   the `zoom` action on buttons, badges, and toasts. Compute WCAG ratios from the
   hex values in `src/theme.ts` to turn "looks bad" into a hard number (AA needs
   4.5:1 for body text).
6. **Toasts auto-dismiss quickly.** Take the screenshot in the same batched
   action as the click that triggers them, otherwise they vanish before capture.
