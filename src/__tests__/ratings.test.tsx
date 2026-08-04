import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
import { products } from '../data/products';
import { seedRatings } from '../data/ratings';
import { rateProduct, resetRatings, useProductRating } from '../hooks/useRatings';

const product = products[0];
const seed = seedRatings[product.id];

function RatingProbe({ productId }: { productId: string }) {
  const { average, count, userRating } = useProductRating(productId);
  return (
    <div>
      <span data-testid="average">{average.toFixed(2)}</span>
      <span data-testid="count">{count}</span>
      <span data-testid="user-rating">{userRating === null ? 'none' : userRating}</span>
    </div>
  );
}

describe('ratings store', () => {
  beforeEach(() => {
    resetRatings();
  });

  it('reports the seeded average before the user rates', () => {
    render(<RatingProbe productId={product.id} />);
    expect(screen.getByTestId('average')).toHaveTextContent((seed.total / seed.count).toFixed(2));
    expect(screen.getByTestId('count')).toHaveTextContent(String(seed.count));
    expect(screen.getByTestId('user-rating')).toHaveTextContent('none');
  });

  it('folds a submitted rating into the average and count', () => {
    render(<RatingProbe productId={product.id} />);
    act(() => {
      rateProduct(product.id, 1);
    });
    expect(screen.getByTestId('average')).toHaveTextContent(
      ((seed.total + 1) / (seed.count + 1)).toFixed(2)
    );
    expect(screen.getByTestId('count')).toHaveTextContent(String(seed.count + 1));
    expect(screen.getByTestId('user-rating')).toHaveTextContent('1');
  });

  it('replaces the previous rating instead of adding a new one', () => {
    render(<RatingProbe productId={product.id} />);
    act(() => {
      rateProduct(product.id, 2);
      rateProduct(product.id, 5);
    });
    expect(screen.getByTestId('count')).toHaveTextContent(String(seed.count + 1));
    expect(screen.getByTestId('user-rating')).toHaveTextContent('5');
  });

  it('clamps ratings to the 1-5 range', () => {
    render(<RatingProbe productId={product.id} />);
    act(() => {
      rateProduct(product.id, 9);
    });
    expect(screen.getByTestId('user-rating')).toHaveTextContent('5');
    act(() => {
      rateProduct(product.id, -3);
    });
    expect(screen.getByTestId('user-rating')).toHaveTextContent('1');
  });

  it('persists ratings to localStorage', () => {
    render(<RatingProbe productId={product.id} />);
    act(() => {
      rateProduct(product.id, 4);
    });
    expect(JSON.parse(localStorage.getItem('onboarding-demo-ratings') || '{}')).toEqual({
      [product.id]: 4,
    });
  });

  it('reports a zero average for a product with no ratings', () => {
    render(<RatingProbe productId="does-not-exist" />);
    expect(screen.getByTestId('average')).toHaveTextContent('0.00');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});

describe('StarRating', () => {
  it('renders a read-only rating with the average and count', () => {
    render(<StarRating value={4.25} count={12} />);
    expect(screen.getByLabelText('Rated 4.3 out of 5 stars')).toBeInTheDocument();
    expect(screen.getByText('4.3 (12)')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders five rating buttons and reports the selected value', () => {
    const onRate = vi.fn();
    render(<StarRating value={0} onRate={onRate} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));
    expect(onRate).toHaveBeenCalledWith(4);
  });
});

describe('ProductCard ratings', () => {
  beforeEach(() => {
    resetRatings();
  });

  it('shows the average rating on the card', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard product={product} />
        </CartProvider>
      </BrowserRouter>
    );
    const average = seed.total / seed.count;
    expect(screen.getByText(`${average.toFixed(1)} (${seed.count})`)).toBeInTheDocument();
  });
});
