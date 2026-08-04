import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductPage } from '../pages/ProductPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { RatingsProvider } from '../context/RatingsContext';
import { products } from '../data/products';

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

async function renderProductPage() {
  render(
    <MemoryRouter initialEntries={[`/product/${products[0].id}`]}>
      <AuthProvider>
        <CartProvider>
          <RatingsProvider>
            <Routes>
              <Route path="/product/:productId" element={<ProductPage />} />
            </Routes>
          </RatingsProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText(products[0].name)).toBeInTheDocument());
}

describe('ProductPage ratings', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('shows interactive stars and no ratings text initially', async () => {
    await renderProductPage();
    expect(screen.getAllByRole('button', { name: /Rate \d star/ })).toHaveLength(5);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });

  it('stores the rating and updates the average when a star is clicked', async () => {
    await renderProductPage();
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));

    expect(screen.getByText('4.0 (1 rating)')).toBeInTheDocument();
    expect(JSON.parse(localStorageMock.getItem('onboarding-demo-ratings') as string)).toEqual({
      [products[0].id]: { anonymous: 4 },
    });
  });

  it('averages the current user rating with existing ratings', async () => {
    localStorageMock.setItem(
      'onboarding-demo-ratings',
      JSON.stringify({ [products[0].id]: { 'other@example.com': 2 } })
    );
    await renderProductPage();
    fireEvent.click(screen.getByLabelText('Rate 5 stars'));

    expect(screen.getByText('3.5 (2 ratings)')).toBeInTheDocument();
  });
});
