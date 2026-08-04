import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders five stars', () => {
    render(<StarRating value={3} />);
    expect(screen.getAllByText('★')).toHaveLength(10);
  });

  it('is read-only when no onRate is provided', () => {
    render(<StarRating value={4} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByLabelText('Rated 4.0 out of 5')).toBeInTheDocument();
  });

  it('renders a clickable button per star when interactive', () => {
    render(<StarRating value={0} onRate={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('calls onRate with the clicked star value', () => {
    const onRate = vi.fn();
    render(<StarRating value={0} onRate={onRate} />);
    fireEvent.click(screen.getByLabelText('Rate 4 stars'));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('fills stars up to the value', () => {
    const { container } = render(<StarRating value={3} />);
    const widths = Array.from(container.querySelectorAll('span[style*="position: absolute"]')).map(
      (el) => (el as HTMLElement).style.width
    );
    expect(widths).toEqual(['100%', '100%', '100%', '0%', '0%']);
  });

  it('fills a half star for fractional averages', () => {
    const { container } = render(<StarRating value={3.4} />);
    const widths = Array.from(container.querySelectorAll('span[style*="position: absolute"]')).map(
      (el) => (el as HTMLElement).style.width
    );
    expect(widths).toEqual(['100%', '100%', '100%', '50%', '0%']);
  });

  it('highlights stars on hover when interactive', () => {
    const { container } = render(<StarRating value={1} onRate={vi.fn()} />);
    fireEvent.mouseEnter(screen.getByLabelText('Rate 5 stars'));
    const widths = Array.from(container.querySelectorAll('span[style*="position: absolute"]')).map(
      (el) => (el as HTMLElement).style.width
    );
    expect(widths).toEqual(['100%', '100%', '100%', '100%', '100%']);
  });
});
