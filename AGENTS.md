# Repository Guidelines

- Use TypeScript with the repository's strict compiler settings.
- Build functional React components with hooks.
- Keep cart state in `CartContext`; do not add parallel state stores.
- Hold money values as numbers and format them when rendering.
- Define prices and rates as named constants instead of magic numbers.
- Put Vitest tests in `src/__tests__/`.
- Follow the existing product object shape and localStorage conventions.
- Keep changes focused and consistent with the surrounding inline styles.
- Before considering a change done, run:
  - `npm test`
  - `npm run lint`
  - `npm run build`
- All three commands must pass before the change is considered complete.
