import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  onRate?: (stars: number) => void;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export function StarRating({ rating, onRate, size = 24, showCount = false, count = 0 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const interactive = !!onRate;
  const displayRating = hoverRating || rating || 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div
        style={{ display: 'flex', gap: '2px' }}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: `${size}px`,
              color: star <= displayRating ? '#E07A5F' : '#D4D0CC',
              transition: 'color 150ms ease',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && count > 0 && (
        <span style={{ color: '#9A9A9A', fontSize: `${size * 0.5}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
