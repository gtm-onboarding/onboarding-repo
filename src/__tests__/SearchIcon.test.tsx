import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SearchIcon } from '../components/icons/SearchIcon';

describe('SearchIcon', () => {
  it('renders svg element', () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });
});
