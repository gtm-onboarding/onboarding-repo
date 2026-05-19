import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RatingsProvider, useRatings } from '../context/RatingsContext';
import { products } from '../data/products';

function TestComponent({ productId }: { productId: string }) {
  const { rateProduct, getAverageRating, getUserRating, getRatingCount } = useRatings();

  return (
    <div>
      <span data-testid="average">{getAverageRating(productId).toFixed(2)}</span>
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

function renderWithProvider(productId: string) {
  return render(
    <RatingsProvider>
      <TestComponent productId={productId} />
    </RatingsProvider>
  );
}

describe('RatingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides seeded ratings for products', () => {
    renderWithProvider(products[0].id);
    const count = parseInt(screen.getByTestId('count').textContent || '0');
    expect(count).toBeGreaterThan(0);
    const average = parseFloat(screen.getByTestId('average').textContent || '0');
    expect(average).toBeGreaterThan(0);
    expect(average).toBeLessThanOrEqual(5);
  });

  it('starts with no user rating', () => {
    renderWithProvider(products[0].id);
    expect(screen.getByTestId('user-rating').textContent).toBe('none');
  });

  it('allows rating a product', () => {
    renderWithProvider(products[0].id);
    const countBefore = parseInt(screen.getByTestId('count').textContent || '0');

    act(() => {
      fireEvent.click(screen.getByText('Rate 4'));
    });

    expect(screen.getByTestId('user-rating').textContent).toBe('4');
    const countAfter = parseInt(screen.getByTestId('count').textContent || '0');
    expect(countAfter).toBe(countBefore + 1);
  });

  it('updates user rating without adding duplicate entries', () => {
    renderWithProvider(products[0].id);

    act(() => {
      fireEvent.click(screen.getByText('Rate 3'));
    });
    const countAfterFirst = parseInt(screen.getByTestId('count').textContent || '0');

    act(() => {
      fireEvent.click(screen.getByText('Rate 5'));
    });
    const countAfterSecond = parseInt(screen.getByTestId('count').textContent || '0');

    expect(screen.getByTestId('user-rating').textContent).toBe('5');
    expect(countAfterSecond).toBe(countAfterFirst);
  });

  it('persists ratings to localStorage', () => {
    renderWithProvider(products[0].id);

    act(() => {
      fireEvent.click(screen.getByText('Rate 4'));
    });

    const stored = localStorage.getItem('onboarding-demo-ratings');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed[products[0].id].userRating).toBe(4);
  });
});
