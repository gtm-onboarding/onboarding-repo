import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RatingProvider, useRating } from '../context/RatingContext';

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

function TestComponent({ productId }: { productId: string }) {
  const { rateProduct, getAverageRating, getRatingCount, getUserRating } = useRating();
  return (
    <div>
      <span data-testid="average">{getAverageRating(productId)}</span>
      <span data-testid="count">{getRatingCount(productId)}</span>
      <span data-testid="user-rating">{getUserRating(productId) ?? 'none'}</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => rateProduct(productId, star)}>
          Rate {star}
        </button>
      ))}
    </div>
  );
}

describe('RatingContext', () => {
  beforeEach(() => {
    localStorage.removeItem(RATINGS_STORAGE_KEY);
  });

  it('starts with no ratings', () => {
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    expect(screen.getByTestId('average')).toHaveTextContent('0');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('user-rating')).toHaveTextContent('none');
  });

  it('allows rating a product', () => {
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Rate 4'));
    });
    expect(screen.getByTestId('average')).toHaveTextContent('4');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('user-rating')).toHaveTextContent('4');
  });

  it('updates an existing user rating', () => {
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Rate 3'));
    });
    expect(screen.getByTestId('user-rating')).toHaveTextContent('3');

    act(() => {
      fireEvent.click(screen.getByText('Rate 5'));
    });
    expect(screen.getByTestId('user-rating')).toHaveTextContent('5');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('average')).toHaveTextContent('5');
  });

  it('persists ratings to localStorage', () => {
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Rate 4'));
    });
    const stored = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '{}');
    expect(stored['test-1']).toBeDefined();
    expect(stored['test-1'].userRating).toBe(4);
    expect(stored['test-1'].ratings).toEqual([4]);
  });

  it('loads ratings from localStorage', () => {
    localStorage.setItem(
      RATINGS_STORAGE_KEY,
      JSON.stringify({
        'test-1': { ratings: [3, 5], userRating: 5 },
      })
    );
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    expect(screen.getByTestId('average')).toHaveTextContent('4');
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('user-rating')).toHaveTextContent('5');
  });

  it('clamps ratings to 1-5', () => {
    render(
      <RatingProvider>
        <TestComponent productId="test-1" />
      </RatingProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('Rate 1'));
    });
    expect(screen.getByTestId('user-rating')).toHaveTextContent('1');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      render(<TestComponent productId="test-1" />);
    }).toThrow('useRating must be used within a RatingProvider');
  });
});
