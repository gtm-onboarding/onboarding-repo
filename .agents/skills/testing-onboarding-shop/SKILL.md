---
name: testing-onboarding-shop
description: How to run and UI-test the Onboarding Demo Shop (React+Vite) locally — auth, cart, checkout, and order history flows.
---

# Testing the Onboarding Demo Shop

## Run it
- `npm install && npm run dev` → http://localhost:5173. No secrets required (`VITE_GOOGLE_CLIENT_ID` optional; Google sign-in is unusable without it, use email signup instead).

## Auth (mock, localStorage)
- Create an account at `/signup` (Name, Email, Password, Confirm Password) — it signs you in immediately and redirects to `/`.
- Sign in again at `/signin` with the same email/password. Users live in `onboarding-demo-users`, session in `onboarding-demo-session`.
- To test per-user data scoping, just sign out and sign up a second email in the same browser; no DB reset needed.

## Reaching key features
- Add to cart: "Add to Cart" buttons on the home page "Featured Products" row; cart badge in header; cart at `/cart`.
- Checkout: `/cart` → "Proceed to Checkout" → fill shipping + payment (any values; there is no validation beyond required fields) → "Place Order" → confirmation modal with "View Orders" / "Continue Shopping".
- Order history: header "Orders" link (only rendered when signed in) or `/orders`. Tax is always 8% of subtotal, so expected totals are computable by hand.
- Orders persist in localStorage under `onboarding-demo-orders:<email>` (`:guest` when signed out).
- The cart may likewise be scoped as `onboarding-demo-cart:<email>` / `:guest`. Check `CartContext` for the current key shape before writing localStorage directly — targeting the wrong key silently makes a corrupt-data test a no-op that looks like a pass.
- Fastest way to a known-clean slate (keeps the accounts): remove every key starting with `onboarding-demo-cart`/`onboarding-demo-orders` plus `onboarding-demo-session`, leaving `onboarding-demo-users`.

## Gotchas
- Cart persistence depends on how `CartContext` hydrates. If `items` is hydrated in a mount `useEffect`, the persist effect overwrites storage with `[]` and the cart is lost on every reload; if it is hydrated in the `useState` initializer, reload works. Check which pattern is in the tree before writing any test step that relies on reloading with a non-empty cart — otherwise prove cart state changes via in-app (SPA) navigation instead.
- The cart key may be global while orders are per-user. Always test "sign out → sign in as another account" and check whether the cart carries over; a shared cart across accounts is a real bug worth reporting.
- When testing per-user scoping, never stop at "B's cart/history is empty" — that looks identical whether the fix works or the code simply wipes data on every switch. Always add the switch-back leg (B builds its own data, switch back to A, confirm A's data is intact and B's did not cross over), plus a guest leg, since sign-out is a third distinct key.
- Two contexts must hydrate synchronously for a signed-in reload to work: the session in `AuthContext` and the items in `CartContext`. If the session hydrates in an effect while the cart key derives from `useAuth()`, the key is briefly `:guest` on load and the signed-in cart reads empty — so test reload while signed in AND while signed out.
- Direct URL navigation to `/checkout` may not be auth-gated even when the cart's "Proceed to Checkout" button is — test both paths separately, and expect signed-out orders to land under the `:guest` order key.
- Quantity has no text input (only -/+ buttons in `CartItem`), so "type junk into quantity" is not reachable via the UI. Exercise clamping via repeated clicks (upper bound is 99) and malformed-state handling by writing bad JSON to localStorage.
- Corrupt-localStorage tests are the one place to use the devtools console (setting keys is not possible via the UI); do all other actions with real clicks.
- Vite HMR after a `git checkout`/cherry-pick can log `The above error occurred in the <App> component` from provider hot-reload. Always confirm with a hard reload (ctrl+shift+r) plus a fresh console read before reporting it as a runtime bug.
- Chrome may pop a "Save card?" bubble after submitting the checkout form and cover the page — dismiss it with "No thanks" before taking evidence screenshots.
- The home page needs `scroll down ~4` before the "Featured Products" Add to Cart buttons are clickable, and page layout shifts between routes, so re-screenshot and confirm control positions instead of reusing coordinates across pages.
- A click on the `/signin` submit button occasionally does not register right after in-app navigation. Verify the header shows the account email after signing in; if it still shows "Sign In", re-navigate to `/signin`, re-enter credentials, and resubmit.
- To reach the 99 quantity cap quickly, use repeated `double_click` on the "+" button, then click several more times and confirm the value is still 99 — clicking exactly to the limit cannot distinguish a working clamp from a coincidence.
- Order storage keys are per-user and unversioned; data saved under an older key is not migrated, so old demo orders can appear to vanish after such a change.

## Devin Secrets Needed
- None.
