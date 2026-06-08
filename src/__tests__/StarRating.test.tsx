import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByLabelText(/star/i);
    expect(stars).toHaveLength(5);
  });

  it('displays the correct rating count when showCount is true', () => {
    render(<StarRating rating={4} showCount count={10} />);
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('does not show count when count is 0', () => {
    render(<StarRating rating={4} showCount count={0} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('calls onRate when a star is clicked in interactive mode', () => {
    const onRate = vi.fn();
    render(<StarRating rating={0} interactive onRate={onRate} />);
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]);
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('does not call onRate when not interactive', () => {
    const onRate = vi.fn();
    render(<StarRating rating={3} onRate={onRate} />);
    const stars = screen.getAllByLabelText(/star/i);
    fireEvent.click(stars[0]);
    expect(onRate).not.toHaveBeenCalled();
  });
});
