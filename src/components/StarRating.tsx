import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onRate?: (rating: number) => void;
  size?: number;
}

const STARS = [1, 2, 3, 4, 5];
const FILLED_COLOR = '#E07A5F';
const EMPTY_COLOR = '#D8D4CF';

function fillFraction(value: number, star: number) {
  const clamped = Math.min(1, Math.max(0, value - (star - 1)));
  return Math.round(clamped * 2) / 2;
}

export function StarRating({ value, onRate, size = 18 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = onRate !== undefined;
  const displayValue = hovered !== null ? hovered : value;

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}
      onMouseLeave={() => setHovered(null)}
      role={interactive ? undefined : 'img'}
      aria-label={interactive ? undefined : `Rated ${value.toFixed(1)} out of 5`}
    >
      {STARS.map((star) => {
        const fill = fillFraction(displayValue, star);
        const glyph = (
          <span style={{ position: 'relative', display: 'inline-block', fontSize: `${size}px` }}>
            <span style={{ color: EMPTY_COLOR }}>★</span>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${fill * 100}%`,
                overflow: 'hidden',
                color: FILLED_COLOR,
              }}
            >
              ★
            </span>
          </span>
        );

        if (!interactive) {
          return <span key={star}>{glyph}</span>;
        }

        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 1px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            {glyph}
          </button>
        );
      })}
    </div>
  );
}
