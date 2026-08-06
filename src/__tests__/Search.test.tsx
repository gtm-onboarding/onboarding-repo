import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { searchProducts } from '../data/products';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('searchProducts', () => {
  it('matches on product name case-insensitively', () => {
    const results = searchProducts('wireless headphones');
    expect(results.map((p) => p.id)).toContain('elec-1');
  });

  it('matches on description text', () => {
    const results = searchProducts('noise cancellation');
    expect(results.map((p) => p.id)).toEqual(['elec-1']);
  });

  it('matches on category', () => {
    const results = searchProducts('clothing');
    expect(results.every((p) => p.category === 'Clothing')).toBe(true);
    expect(results.length).toBe(4);
  });

  it('requires every term to match', () => {
    expect(searchProducts('smart nonexistentterm')).toEqual([]);
  });

  it('returns no results for an empty or whitespace query', () => {
    expect(searchProducts('')).toEqual([]);
    expect(searchProducts('   ')).toEqual([]);
  });
});

describe('SearchBar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders in the header', () => {
    renderApp();
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
  });

  it('navigates to results on submit', () => {
    renderApp();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: 'speaker' } });
    fireEvent.submit(input);
    expect(screen.getByText('Search results')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
  });

  it('stays on the current page when the query is blank', () => {
    renderApp();
    const input = screen.getByLabelText('Search products');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input);
    expect(screen.queryByText('Search results')).not.toBeInTheDocument();
  });

  it('is prefilled from the url query', () => {
    renderApp('/search?q=lamp');
    expect(screen.getByLabelText('Search products')).toHaveValue('lamp');
  });
});

describe('SearchPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('shows matching products and a result count', () => {
    renderApp('/search?q=lamp');
    expect(screen.getByText('1 result for "lamp"')).toBeInTheDocument();
    expect(screen.getByText('LED Desk Lamp')).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    renderApp('/search?q=zzzz');
    expect(screen.getByText('No products match "zzzz"')).toBeInTheDocument();
  });

  it('prompts for a term when the query is missing', () => {
    renderApp('/search');
    expect(screen.getByText('Enter a search term to find products')).toBeInTheDocument();
  });
});
