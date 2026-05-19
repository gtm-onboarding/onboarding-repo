import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingsProvider, useRatings } from '../context/RatingsContext';

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
  const { rateProduct, getAverageRating, getRatingCount, getUserRating } = useRatings();
  return (
    <div>
      <span data-testid="avg-elec-1">{getAverageRating('elec-1').toFixed(2)}</span>
      <span data-testid="count-elec-1">{getRatingCount('elec-1')}</span>
      <span data-testid="user-elec-1">{getUserRating('elec-1') ?? 'none'}</span>
      <span data-testid="avg-elec-2">{getAverageRating('elec-2').toFixed(2)}</span>
      <button onClick={() => rateProduct('elec-1', 4)}>Rate elec-1 four</button>
      <button onClick={() => rateProduct('elec-1', 2)}>Rate elec-1 two</button>
      <button onClick={() => rateProduct('elec-2', 5)}>Rate elec-2 five</button>
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
    expect(screen.getByTestId('avg-elec-1').textContent).toBe('0.00');
    expect(screen.getByTestId('count-elec-1').textContent).toBe('0');
    expect(screen.getByTestId('user-elec-1').textContent).toBe('none');
  });

  it('allows rating a product', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate elec-1 four'));
    expect(screen.getByTestId('avg-elec-1').textContent).toBe('4.00');
    expect(screen.getByTestId('count-elec-1').textContent).toBe('1');
    expect(screen.getByTestId('user-elec-1').textContent).toBe('4');
  });

  it('updates user rating on same product', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate elec-1 four'));
    fireEvent.click(screen.getByText('Rate elec-1 two'));
    expect(screen.getByTestId('user-elec-1').textContent).toBe('2');
    expect(screen.getByTestId('count-elec-1').textContent).toBe('1');
    expect(screen.getByTestId('avg-elec-1').textContent).toBe('2.00');
  });

  it('tracks ratings for different products independently', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate elec-1 four'));
    fireEvent.click(screen.getByText('Rate elec-2 five'));
    expect(screen.getByTestId('avg-elec-1').textContent).toBe('4.00');
    expect(screen.getByTestId('avg-elec-2').textContent).toBe('5.00');
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate elec-1 four'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
