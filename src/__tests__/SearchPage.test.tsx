import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SearchPage } from '../pages/SearchPage';
import { CartProvider } from '../context/CartContext';
import { searchProducts } from '../data/products';

function renderSearchPage(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <CartProvider>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('searchProducts', () => {
  it('matches on product name case-insensitively', () => {
    expect(searchProducts('WIRELESS').map((p) => p.name)).toContain('Wireless Headphones');
  });

  it('matches on category', () => {
    const results = searchProducts('Electronics');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.category === 'Electronics')).toBe(true);
  });

  it('returns nothing for a blank query', () => {
    expect(searchProducts('   ')).toEqual([]);
  });
});

describe('SearchPage', () => {
  it('renders matching products for the query', () => {
    renderSearchPage('/search?q=headphones');
    expect(screen.getByText('Results for "headphones"')).toBeInTheDocument();
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    renderSearchPage('/search?q=zzzznotaproduct');
    expect(screen.getByText('No products match "zzzznotaproduct"')).toBeInTheDocument();
  });

  it('prompts for a search term when q is missing', () => {
    renderSearchPage('/search');
    expect(screen.getByText('Enter a search term to find products')).toBeInTheDocument();
  });

  it('reflects the result count from the URL query', () => {
    const expected = searchProducts('watch').length;
    renderSearchPage('/search?q=watch');
    expect(
      screen.getByText(`${expected} ${expected === 1 ? 'product' : 'products'} found`)
    ).toBeInTheDocument();
  });
});
