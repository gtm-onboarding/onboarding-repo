# Onboarding Demo App

A React-based ecommerce demo application designed for coding demonstration tasks.

## Tech Stack

- React 18 with TypeScript
- Vite (build tool)
- React Router v6
- Vitest + React Testing Library
- ESLint

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── icons/        # SVG icon components
├── context/          # React Context providers (Cart, Auth)
├── data/             # Mock product data
├── pages/            # Page components
├── types/            # TypeScript interfaces
├── __tests__/        # Test files
├── App.tsx           # Main app with routes
└── main.tsx          # Entry point
```

## Features

- Product catalog with categories
- Shopping cart with localStorage persistence
- User authentication (mock)
- Checkout flow with order confirmation
- Toast notifications
- Light/dark theme with a header toggle, persisted in localStorage

## Theming

Palette values live in `src/App.css` as `--color-*` / `--shadow-*` custom properties, defined
twice: once under `:root[data-theme='light']` and once under `:root[data-theme='dark']`.
`src/theme.ts` exposes those variables as tokens (`theme.colors.text`, `theme.shadows.md`, …)
for use in inline styles, so switching themes is a single `data-theme` change on `<html>`.

- Use `theme.colors.*` / `theme.shadows.*` in components — never hardcode a hex value.
- `ThemeContext` (`src/context/ThemeContext.tsx`) owns the active theme: it reads the
  `onboarding-demo-theme` localStorage key, falls back to `prefers-color-scheme`, and syncs
  `document.documentElement.dataset.theme`.
- An inline script in `index.html` applies the stored theme before first paint to avoid a flash
  of the wrong theme; keep it in sync with the storage key if that ever changes.
- Adding a token means adding it to both `:root` blocks in `App.css` and to `colorTokens` /
  `shadowTokens` in `theme.ts`.


