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
  const { rateProduct, getAverageRating, getRatingCount } = useRatings();
  return (
    <div>
      <span data-testid="average">{getAverageRating('1').toFixed(2)}</span>
      <span data-testid="count">{getRatingCount('1')}</span>
      <span data-testid="other-count">{getRatingCount('2')}</span>
      <button onClick={() => rateProduct('1', 5)}>Rate 5</button>
      <button onClick={() => rateProduct('1', 2)}>Rate 2</button>
      <button onClick={() => rateProduct('1', 9)}>Rate 9</button>
      <button onClick={() => rateProduct('2', 3)}>Rate Other 3</button>
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

  it('records a rating', () => {
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

  it('keeps ratings separate per product', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 5'));
    fireEvent.click(screen.getByText('Rate Other 3'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('other-count').textContent).toBe('1');
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 5'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'onboarding-demo-ratings',
      JSON.stringify({ '1': [5] })
    );
  });

  it('loads ratings from localStorage on mount', () => {
    localStorageMock.setItem('onboarding-demo-ratings', JSON.stringify({ '1': [4, 2] }));
    renderWithProvider();
    expect(screen.getByTestId('average').textContent).toBe('3.00');
    expect(screen.getByTestId('count').textContent).toBe('2');
  });
});
