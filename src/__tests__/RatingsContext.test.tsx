import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

function RatingsHarness() {
  const { getRating, rateProduct } = useRatings();
  const rating = getRating('elec-1');

  return (
    <div>
      <span>{`average:${rating.average}`}</span>
      <span>{`count:${rating.count}`}</span>
      <span>{`user:${rating.userRating}`}</span>
      <button onClick={() => rateProduct('elec-1', 4)}>rate 4</button>
      <button onClick={() => rateProduct('elec-1', 2)}>rate 2</button>
    </div>
  );
}

function renderHarness() {
  return render(
    <RatingsProvider>
      <RatingsHarness />
    </RatingsProvider>
  );
}

describe('RatingsContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no rating', () => {
    renderHarness();
    expect(screen.getByText('average:0')).toBeInTheDocument();
    expect(screen.getByText('count:0')).toBeInTheDocument();
    expect(screen.getByText('user:null')).toBeInTheDocument();
  });

  it('records a rating and persists it', () => {
    renderHarness();
    fireEvent.click(screen.getByText('rate 4'));
    expect(screen.getByText('average:4')).toBeInTheDocument();
    expect(screen.getByText('count:1')).toBeInTheDocument();
    expect(localStorage.getItem('onboarding-demo-ratings')).toContain('"userRating":4');
  });

  it('replaces the previous rating instead of adding another', () => {
    renderHarness();
    fireEvent.click(screen.getByText('rate 4'));
    fireEvent.click(screen.getByText('rate 2'));
    expect(screen.getByText('average:2')).toBeInTheDocument();
    expect(screen.getByText('count:1')).toBeInTheDocument();
  });

  it('averages ratings loaded from storage', () => {
    localStorage.setItem(
      'onboarding-demo-ratings',
      JSON.stringify({ 'elec-1': { ratings: [5, 4], userRating: null } })
    );
    renderHarness();
    expect(screen.getByText('average:4.5')).toBeInTheDocument();
    expect(screen.getByText('count:2')).toBeInTheDocument();
  });

  it('clears corrupt stored ratings', () => {
    localStorage.setItem('onboarding-demo-ratings', 'not json');
    act(() => {
      renderHarness();
    });
    expect(screen.getByText('count:0')).toBeInTheDocument();
  });
});
