import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
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

describe('ProductCard Hover', () => {
  it('scales image on mouse over and resets on mouse out', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <ProductCard product={products[0]} />
        </CartProvider>
      </MemoryRouter>
    );
    const img = screen.getByAltText(products[0].name);
    fireEvent.mouseOver(img);
    expect(img.style.transform).toBe('scale(1.05)');
    fireEvent.mouseOut(img);
    expect(img.style.transform).toBe('scale(1)');
  });

  it('renders product description', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <ProductCard product={products[0]} />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(products[0].description)).toBeInTheDocument();
  });
});
