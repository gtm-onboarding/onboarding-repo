import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onRate?: (rating: number) => void;
  size?: number;
  label?: string;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, onRate, size = 20, label }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = onRate !== undefined;
  const displayed = hovered ?? value;

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={label ?? `Rated ${value.toFixed(1)} out of 5 stars`}
        style={{ display: 'inline-flex', gap: '2px', fontSize: `${size}px`, lineHeight: '1' }}
      >
        {STARS.map((star) => (
          <span key={star} style={{ color: star <= Math.round(value) ? '#E07A5F' : '#E8E6E3' }}>
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      role="radiogroup"
      aria-label={label ?? 'Rate this product'}
      style={{ display: 'inline-flex', gap: '4px' }}
      onMouseLeave={() => setHovered(null)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(null)}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            fontSize: `${size}px`,
            lineHeight: '1',
            color: star <= displayed ? '#E07A5F' : '#E8E6E3',
            transition: 'color 150ms ease',
          }}
        >
          ★
        </button>
      ))}
    </span>
  );
}
