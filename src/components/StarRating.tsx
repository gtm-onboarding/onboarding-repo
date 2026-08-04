import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onRate?: (stars: number) => void;
  size?: number;
  count?: number;
}

const STARS = [1, 2, 3, 4, 5];

const FILLED_COLOR = '#E07A5F';
const EMPTY_COLOR = '#D6D3CE';

export function StarRating({ value, onRate, size = 18, count }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = Boolean(onRate);
  const displayValue = hovered ?? Math.round(value);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{ display: 'inline-flex', gap: '2px', lineHeight: 1 }}
        onMouseLeave={() => setHovered(null)}
      >
        {STARS.map((star) => {
          const filled = star <= displayValue;
          const glyph = filled ? '★' : '☆';
          if (!interactive) {
            return (
              <span
                key={star}
                aria-hidden="true"
                style={{ color: filled ? FILLED_COLOR : EMPTY_COLOR, fontSize: `${size}px` }}
              >
                {glyph}
              </span>
            );
          }
          return (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
              onClick={() => onRate?.(star)}
              onMouseEnter={() => setHovered(star)}
              onFocus={() => setHovered(star)}
              onBlur={() => setHovered(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 2px',
                cursor: 'pointer',
                color: filled ? FILLED_COLOR : EMPTY_COLOR,
                fontSize: `${size}px`,
                lineHeight: 1,
              }}
            >
              {glyph}
            </button>
          );
        })}
      </span>
      {count !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 5)}px` }}>
          ({count})
        </span>
      )}
    </div>
  );
}
