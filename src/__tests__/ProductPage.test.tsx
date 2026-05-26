import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProductPage } from '../pages/ProductPage';
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

function renderProductPage(productId: string) {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <CartProvider>
        <Routes>
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('ProductPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows loading skeleton initially', () => {
    const { container } = renderProductPage(products[0].id);
    const skeletons = container.querySelectorAll('[style*="background-color: rgb(245, 243, 240)"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows product details after loading', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(products[0].description)).toBeInTheDocument();
    expect(screen.getByText(`$${products[0].price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('shows product not found for invalid id', () => {
    renderProductPage('invalid-id');
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    expect(screen.getByText("The product you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('shows category label', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText(products[0].category)).toBeInTheDocument();
  });

  it('shows back link to category', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText(`Back to ${products[0].category}`, { exact: false })).toBeInTheDocument();
  });

  it('starts with quantity 1', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments quantity', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements quantity but not below 1', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('caps quantity at 99', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    for (let i = 0; i < 100; i++) {
      fireEvent.click(screen.getByText('+'));
    }
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('adds to cart with selected quantity', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Add to Cart'));
  });

  it('renders product image', () => {
    renderProductPage(products[0].id);
    act(() => { vi.advanceTimersByTime(200); });
    const img = screen.getByAltText(products[0].name);
    expect(img).toHaveAttribute('src', products[0].image);
  });
});
