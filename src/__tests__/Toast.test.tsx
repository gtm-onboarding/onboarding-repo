import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../components/Toast';

describe('Toast', () => {
  it('renders success toast by default', () => {
    const onClose = vi.fn();
    render(<Toast message="Item added" onClose={onClose} />);
    expect(screen.getByText('Item added')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders error toast', () => {
    const onClose = vi.fn();
    render(<Toast message="Something went wrong" type="error" onClose={onClose} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Toast message="Test" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close notification'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies success styles', () => {
    const onClose = vi.fn();
    const { container } = render(<Toast message="Success" type="success" onClose={onClose} />);
    const toast = container.firstChild as HTMLElement;
    expect(toast).toHaveStyle({ backgroundColor: '#E8F5E9' });
  });

  it('applies error styles', () => {
    const onClose = vi.fn();
    const { container } = render(<Toast message="Error" type="error" onClose={onClose} />);
    const toast = container.firstChild as HTMLElement;
    expect(toast).toHaveStyle({ backgroundColor: '#FEF2F2' });
  });
});
