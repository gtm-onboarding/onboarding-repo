import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders read-only stars when no onRate handler is given', () => {
    render(<StarRating value={4} />);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByLabelText('Rated 4.0 out of 5 stars')).toBeInTheDocument();
  });

  it('renders five interactive stars', () => {
    render(<StarRating value={0} onRate={vi.fn()} />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('calls onRate with the selected star value', () => {
    const onRate = vi.fn();
    render(<StarRating value={0} onRate={onRate} />);
    fireEvent.click(screen.getByLabelText('4 stars'));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('marks the selected star as checked', () => {
    render(<StarRating value={3} onRate={vi.fn()} />);
    expect(screen.getByLabelText('3 stars')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText('1 star')).toHaveAttribute('aria-checked', 'false');
  });
});
