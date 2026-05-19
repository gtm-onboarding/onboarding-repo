import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rating={3} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(5);
  });

  it('displays count when provided', () => {
    render(<StarRating rating={4.2} count={42} />);
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });

  it('does not display count when not provided', () => {
    render(<StarRating rating={4} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('calls onRate when interactive star is clicked', () => {
    const onRate = vi.fn();
    render(<StarRating rating={0} interactive onRate={onRate} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('renders stars with correct aria labels when interactive', () => {
    render(<StarRating rating={0} interactive onRate={vi.fn()} />);
    expect(screen.getByLabelText('Rate 1 star')).toBeInTheDocument();
    expect(screen.getByLabelText('Rate 2 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('Rate 5 stars')).toBeInTheDocument();
  });

  it('does not render button roles when not interactive', () => {
    render(<StarRating rating={3} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
