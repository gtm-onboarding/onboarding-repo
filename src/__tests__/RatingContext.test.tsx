import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RatingProvider, useRating } from '../context/RatingContext';

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
  const { addRating, getAverageRating, getRatingCount, getUserRating } = useRating();
  return (
    <div>
      <span data-testid="avg-p1">{getAverageRating('p1').toFixed(2)}</span>
      <span data-testid="count-p1">{getRatingCount('p1')}</span>
      <span data-testid="user-p1">{getUserRating('p1') ?? 'none'}</span>
      <button onClick={() => addRating('p1', 4)}>Rate 4</button>
      <button onClick={() => addRating('p1', 2)}>Rate 2</button>
      <button onClick={() => addRating('p2', 5)}>Rate P2 5</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <BrowserRouter>
      <RatingProvider>
        <TestComponent />
      </RatingProvider>
    </BrowserRouter>
  );
}

describe('RatingContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no ratings', () => {
    renderWithProvider();
    expect(screen.getByTestId('avg-p1').textContent).toBe('0.00');
    expect(screen.getByTestId('count-p1').textContent).toBe('0');
    expect(screen.getByTestId('user-p1').textContent).toBe('none');
  });

  it('adds a rating', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    expect(screen.getByTestId('avg-p1').textContent).toBe('4.00');
    expect(screen.getByTestId('count-p1').textContent).toBe('1');
    expect(screen.getByTestId('user-p1').textContent).toBe('4');
  });

  it('replaces user rating on re-rate', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    fireEvent.click(screen.getByText('Rate 2'));
    expect(screen.getByTestId('avg-p1').textContent).toBe('2.00');
    expect(screen.getByTestId('count-p1').textContent).toBe('1');
    expect(screen.getByTestId('user-p1').textContent).toBe('2');
  });

  it('handles ratings for different products independently', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    fireEvent.click(screen.getByText('Rate P2 5'));
    expect(screen.getByTestId('avg-p1').textContent).toBe('4.00');
    expect(screen.getByTestId('count-p1').textContent).toBe('1');
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Rate 4'));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
