import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CategoryPage } from '../pages/CategoryPage';
import { CartProvider } from '../context/CartContext';

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

function renderCategoryPage(category: string) {
  return render(
    <MemoryRouter initialEntries={[`/category/${encodeURIComponent(category)}`]}>
      <CartProvider>
        <Routes>
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CategoryPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows loading skeletons initially', () => {
    const { container } = renderCategoryPage('Electronics');
    const skeletons = container.querySelectorAll('[style*="height: 360px"]');
    expect(skeletons.length).toBe(4);
  });

  it('shows products after loading', () => {
    renderCategoryPage('Electronics');
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('shows category name as heading', () => {
    renderCategoryPage('Electronics');
    expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
  });

  it('shows product count', () => {
    renderCategoryPage('Electronics');
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText('4 products available')).toBeInTheDocument();
  });

  it('shows empty state for unknown category', () => {
    renderCategoryPage('NonExistent');
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText('No products found in this category')).toBeInTheDocument();
  });

  it('renders category menu with active category', () => {
    renderCategoryPage('Electronics');
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('handles missing categoryId param gracefully', () => {
    render(
      <MemoryRouter initialEntries={['/category']}>
        <CartProvider>
          <Routes>
            <Route path="/category" element={<CategoryPage />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText('No products found in this category')).toBeInTheDocument();
  });
});
