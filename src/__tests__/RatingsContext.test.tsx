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

function TestComponent() {
  const { rateProduct, getAverageRating, getRatingCount } = useRatings();
  const productId = products[0].id;
  return (
    <div>
      <span data-testid="average">{getAverageRating(productId).toFixed(2)}</span>
      <span data-testid="count">{getRatingCount(productId)}</span>
      <button onClick={() => rateProduct(productId, 5)}>Rate 5</button>
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
    expect(screen.getByTestId('average').textContent).toBe('0.00');
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('records a rating and updates the average', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 5'));
    expect(screen.getByTestId('average').textContent).toBe('5.00');
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('averages multiple ratings', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 5'));
    fireEvent.click(screen.getByText('Rate 2'));
    expect(screen.getByTestId('average').textContent).toBe('3.50');
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('clamps ratings to a maximum of 5', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 9'));
    expect(screen.getByTestId('average').textContent).toBe('5.00');
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 5'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
