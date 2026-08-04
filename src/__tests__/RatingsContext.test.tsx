import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingsProvider, useRatings } from '../context/RatingsContext';
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

const productId = products[0].id;

function TestComponent() {
  const { rateProduct, getUserRating, getRatingSummary } = useRatings();
  const { average, count } = getRatingSummary(productId);
  return (
    <div>
      <span data-testid="average">{average.toFixed(1)}</span>
      <span data-testid="count">{count}</span>
      <span data-testid="user-rating">{getUserRating(productId) ?? 'none'}</span>
      <button onClick={() => rateProduct(productId, 4)}>Rate 4</button>
      <button onClick={() => rateProduct(productId, 2)}>Rate 2</button>
      <button onClick={() => rateProduct(productId, 9)}>Rate 9</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <RatingsProvider>
      <TestComponent />
    </RatingsProvider>
  );
}

describe('RatingsContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no ratings', () => {
    renderWithProvider();
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('user-rating').textContent).toBe('none');
  });

  it('records a rating', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    expect(screen.getByTestId('average').textContent).toBe('4.0');
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('user-rating').textContent).toBe('4');
  });

  it('replaces an existing rating instead of adding another', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    fireEvent.click(screen.getByText('Rate 2'));
    expect(screen.getByTestId('average').textContent).toBe('2.0');
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('ignores out-of-range ratings', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 9'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    const stored = JSON.parse(localStorageMock.getItem('onboarding-demo-ratings') as string);
    expect(stored.ratings[productId]).toEqual([4]);
    expect(stored.userRatings[productId]).toBe(4);
  });

  it('restores ratings from localStorage', () => {
    localStorageMock.setItem(
      'onboarding-demo-ratings',
      JSON.stringify({ ratings: { [productId]: [5, 3] }, userRatings: { [productId]: 5 } })
    );
    renderWithProvider();
    expect(screen.getByTestId('average').textContent).toBe('4.0');
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('user-rating').textContent).toBe('5');
  });
});
