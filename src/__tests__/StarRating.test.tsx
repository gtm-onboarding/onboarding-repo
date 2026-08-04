import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

const mockRateProduct = vi.fn();
let mockRatings: Record<string, number[]> = {};

vi.mock('../context/RatingsContext', async () => {
  const actual = await vi.importActual('../context/RatingsContext');
  return {
    ...actual,
    useRatings: () => ({
      ratings: mockRatings,
      rateProduct: mockRateProduct,
      getAverageRating: (productId: string) => {
        const values = mockRatings[productId] ?? [];
        if (values.length === 0) return 0;
        return values.reduce((sum, value) => sum + value, 0) / values.length;
      },
      getRatingCount: (productId: string) => mockRatings[productId]?.length ?? 0,
    }),
  };
});

function filledStarCount(container: HTMLElement) {
  return container.querySelectorAll('path[stroke="#E07A5F"]').length;
}

describe('StarRating', () => {
  beforeEach(() => {
    mockRatings = {};
    vi.clearAllMocks();
  });

  it('renders five stars in interactive mode', () => {
    render(<StarRating productId="1" interactive />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('submits a rating when a star is clicked', () => {
    render(<StarRating productId="1" interactive />);
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));
    expect(mockRateProduct).toHaveBeenCalledWith('1', 4);
  });

  it('previews the hovered rating without submitting', () => {
    const { container } = render(<StarRating productId="1" interactive />);
    fireEvent.mouseEnter(screen.getByLabelText('Rate 3 stars'));
    expect(filledStarCount(container)).toBe(3);
    expect(mockRateProduct).not.toHaveBeenCalled();
  });

  it('renders the average and count in read-only mode', () => {
    mockRatings = { '1': [5, 4] };
    render(<StarRating productId="1" />);
    expect(screen.getByText('4.5 (2)')).toBeInTheDocument();
  });

  it('fills whole stars up to the average', () => {
    mockRatings = { '1': [4, 3] };
    const { container } = render(<StarRating productId="1" />);
    expect(filledStarCount(container)).toBe(3);
  });

  it('shows an empty state in read-only mode with no ratings', () => {
    render(<StarRating productId="1" />);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });
});
