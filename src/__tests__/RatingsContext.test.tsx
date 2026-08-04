import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingsProvider, useRatings } from '../context/RatingsContext';

function RatingsProbe({ productId = 'product-1' }: { productId?: string }) {
  const { rateProduct, getAverageRating, getRatingCount, getUserRating } = useRatings();
  const average = getAverageRating(productId);
  return (
    <div>
      <span data-testid="average">{average === null ? 'none' : average.toFixed(1)}</span>
      <span data-testid="count">{getRatingCount(productId)}</span>
      <span data-testid="user-rating">{getUserRating(productId) ?? 'none'}</span>
      <button onClick={() => rateProduct(productId, 4)}>Rate four</button>
      <button onClick={() => rateProduct(productId, 2)}>Rate two</button>
      <button onClick={() => rateProduct(productId, 6)}>Rate six</button>
      <button onClick={() => rateProduct(productId, 0)}>Rate zero</button>
    </div>
  );
}

function renderRatingsProbe() {
  return render(
    <RatingsProvider>
      <RatingsProbe />
    </RatingsProvider>
  );
}

describe('RatingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('tracks average and count when a product is rated', () => {
    renderRatingsProbe();
    fireEvent.click(screen.getByText('Rate four'));
    expect(screen.getByTestId('average')).toHaveTextContent('4.0');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('user-rating')).toHaveTextContent('4');
  });

  it('replaces the visitor rating instead of double-counting it', () => {
    renderRatingsProbe();
    fireEvent.click(screen.getByText('Rate four'));
    fireEvent.click(screen.getByText('Rate two'));
    expect(screen.getByTestId('average')).toHaveTextContent('2.0');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('persists ratings to localStorage', () => {
    const { unmount } = renderRatingsProbe();
    fireEvent.click(screen.getByText('Rate four'));
    expect(localStorage.getItem('onboarding-demo-ratings')).toContain('"sum":4');
    unmount();
    renderRatingsProbe();
    expect(screen.getByTestId('average')).toHaveTextContent('4.0');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('user-rating')).toHaveTextContent('4');
  });

  it('clamps out-of-range ratings to the nearest valid star', () => {
    renderRatingsProbe();
    fireEvent.click(screen.getByText('Rate six'));
    expect(screen.getByTestId('average')).toHaveTextContent('5.0');
    fireEvent.click(screen.getByText('Rate zero'));
    expect(screen.getByTestId('average')).toHaveTextContent('1.0');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});
