import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onRate?: (stars: number) => void;
  readOnly?: boolean;
  size?: number;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, onRate, readOnly = false, size = 20 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}
      onMouseLeave={() => setHovered(0)}
    >
      {STARS.map((star) => {
        const filled = star <= Math.round(displayValue);
        return (
          <span
            key={star}
            role={readOnly ? undefined : 'button'}
            aria-label={readOnly ? undefined : `Rate ${star} star${star === 1 ? '' : 's'}`}
            onClick={readOnly ? undefined : () => onRate?.(star)}
            onMouseEnter={readOnly ? undefined : () => setHovered(star)}
            style={{
              color: filled ? '#E07A5F' : '#9A9A9A',
              fontSize: `${size}px`,
              cursor: readOnly ? 'default' : 'pointer',
              userSelect: 'none',
            }}
          >
            {filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
