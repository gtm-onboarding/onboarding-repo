---
name: testing-onboarding-shop
description: How to run and UI-test the Onboarding Shop demo app (React 18 + TS + Vite, client-side only, mock auth in localStorage) — startup, login, reaching cart/checkout/orders, and known traps.
---

# Testing the Onboarding Shop demo app

## Startup
- `npm install` then `npm run dev` → Vite serves http://localhost:5173. No backend, no API keys, no
  secrets needed. **Devin Secrets Needed: none.**
- The repo blueprint already runs `npm install` as maintenance, so usually only `npm run dev` is needed.
- Before recording, maximize the window with
  `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.

## State lives entirely in localStorage
Keys (all under the `onboarding-demo-` prefix):
- `onboarding-demo-users` — registered accounts, `onboarding-demo-session` — signed-in user
- `onboarding-demo-cart` — cart, `onboarding-demo-orders` — order history (one array for ALL users,
  filtered by `userEmail` at display time)

Start each run from a clean slate with `localStorage.clear(); location.reload()` in the console
(do this BEFORE starting the recording so the video shows no devtools usage). Verifying the raw
array afterwards is useful *supporting* evidence, but pass/fail must come from the UI.

## Auth (mock)
- `/signup` with any name/email/password (≥6 chars) immediately signs you in; `/signin` re-signs in
  an existing account. `signUp` returns false silently if the email already exists — use a fresh
  email per run (e.g. `alice+<ticket>@example.com`).
- Sign out via the "Sign Out" button in the header (present on every page, including `/checkout`).

## Reaching the flows
- Add to cart: home page "Featured Products" or a `/category/<Name>` page → "Add to Cart".
- Cart: cart icon top-right → `/cart` → "Proceed to Checkout".
- **Checkout requires being signed in via the UI path**: `/cart`'s button redirects to
  `/signin?redirect=/checkout` when signed out.
- Checkout form: Full Name / Address / City / ZIP / Card Number / Expiry / CVV are all `required`;
  fill all of them or the submit is blocked. Then "Place Order" → "Order Confirmed!" modal →
  "Continue Shopping" (this is when the cart is cleared).
- Order history: `/orders`, linked from the header "Orders" link which renders **only when
  authenticated**; while signed out you must type the URL.

## Known traps
- **Hard-loading `/checkout` directly wipes the cart** and bounces to `/cart`: the empty-cart guard
  in `CheckoutPage` runs before `CartProvider` hydrates from localStorage, and the persist effect
  then writes the empty array back. So never navigate to `/checkout` by typing the URL — always get
  there by clicking through `/cart`. (Same class of race may affect other hard-loaded pages that read
  cart state; if a page looks empty after a URL-bar navigation, retry via in-app clicks before
  filing a bug.) To exercise the *anonymous* checkout branch, enter checkout signed in and then click
  "Sign Out" in the header before pressing "Place Order".
- Chrome may pop a "save card?" bubble after submitting the payment form; it overlaps the modal —
  dismiss it (click its ✕ around the right end of the omnibox) before clicking modal buttons.
- Click coordinates shift a lot because pages keep their scroll position across client-side
  navigation. After navigating, take a screenshot and re-derive coordinates instead of reusing them;
  verify text landed in the right field (a mis-targeted click silently concatenates into the
  previous input).
- "Add to Cart" clicks issued immediately after a navigation sometimes don't register — always
  confirm the cart badge count changed before moving on.

## Money math to assert against
Tax is 8% of subtotal, total = subtotal + tax, both rounded to 2 dp only for display. Useful prices:
Wireless Headphones 79.99, Smart Watch 199.99, Bluetooth Speaker 49.99, USB-C Hub 34.99,
Denim Jacket 89.99, Running Shoes 129.99, Cotton T-Shirt 24.99, Winter Beanie 19.99.
Always assert exact dollar strings (e.g. Subtotal $209.97 / Tax $16.80 / Total $226.77) rather than
"totals look right".
