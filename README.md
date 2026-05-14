# SKO Demo App

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


