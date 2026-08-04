import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders five stars', () => {
    render(<StarRating value={3} />);
    expect(screen.getByLabelText('3 out of 5 stars')).toBeInTheDocument();
    expect(screen.getAllByText('★')).toHaveLength(3);
    expect(screen.getAllByText('☆')).toHaveLength(2);
  });

  it('calls onRate with the clicked value', () => {
    const onRate = vi.fn();
    render(<StarRating value={2} onRate={onRate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Rate 4 stars' }));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('is non-interactive when no onRate is provided', () => {
    render(<StarRating value={4} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
