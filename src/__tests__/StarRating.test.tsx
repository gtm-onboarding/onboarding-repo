import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders five stars', () => {
    render(<StarRating value={0} readOnly />);
    expect(screen.getAllByText('☆')).toHaveLength(5);
  });

  it('fills stars up to the rounded value', () => {
    render(<StarRating value={3.4} readOnly />);
    expect(screen.getAllByText('★')).toHaveLength(3);
    expect(screen.getAllByText('☆')).toHaveLength(2);
  });

  it('calls onRate with the clicked star value', () => {
    const onRate = vi.fn();
    render(<StarRating value={0} onRate={onRate} />);
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('does not expose buttons when read only', () => {
    render(<StarRating value={2} readOnly />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('highlights stars on hover', () => {
    render(<StarRating value={0} onRate={vi.fn()} />);
    fireEvent.mouseEnter(screen.getByLabelText('Rate 3 stars'));
    expect(screen.getAllByText('★')).toHaveLength(3);
  });
});
