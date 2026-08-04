import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('shows empty state when there are no ratings', () => {
    render(<StarRating value={0} count={0} />);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });

  it('shows average and count when rated', () => {
    render(<StarRating value={4.25} count={4} />);
    expect(screen.getByText('4.3 (4)')).toBeInTheDocument();
  });

  it('renders no buttons when read-only', () => {
    render(<StarRating value={3} count={1} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('calls onRate with the selected star', () => {
    const onRate = vi.fn();
    render(<StarRating value={0} count={0} onRate={onRate} />);
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));
    expect(onRate).toHaveBeenCalledWith(4);
  });
});
