import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders five stars', () => {
    const { container } = render(<StarRating rating={3} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(5);
  });

  it('displays rating count when provided', () => {
    render(<StarRating rating={4.5} count={25} />);
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  it('does not display count when not provided', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('calls onRate when a star is clicked in interactive mode', () => {
    const onRate = vi.fn();
    render(<StarRating rating={0} interactive onRate={onRate} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('does not render buttons in non-interactive mode', () => {
    render(<StarRating rating={4} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
