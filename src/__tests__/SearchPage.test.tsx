import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchPage } from '../pages/SearchPage';
import { CartProvider } from '../context/CartContext';
import { searchProducts } from '../data/products';

function renderSearchPage(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/search${search}`]}>
      <CartProvider>
        <SearchPage />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('searchProducts', () => {
  it('matches on name, description and category case-insensitively', () => {
    expect(searchProducts('wireless headphones').map((p) => p.id)).toContain('elec-1');
    expect(searchProducts('noise cancellation').map((p) => p.id)).toContain('elec-1');
    expect(searchProducts('clothing').every((p) => p.category === 'Clothing')).toBe(true);
  });

  it('returns nothing for an empty query', () => {
    expect(searchProducts('   ')).toEqual([]);
  });
});

describe('SearchPage', () => {
  it('shows matching products for a query', async () => {
    renderSearchPage('?q=watch');
    expect(await screen.findByText('Smart Watch')).toBeInTheDocument();
    expect(screen.getByText(/Results for "watch"/)).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    renderSearchPage('?q=zzzzz');
    expect(await screen.findByText('No products found for "zzzzz"')).toBeInTheDocument();
  });

  it('prompts for a term when the query is missing', async () => {
    renderSearchPage('');
    expect(await screen.findByText('Enter a search term to find products')).toBeInTheDocument();
  });
});
