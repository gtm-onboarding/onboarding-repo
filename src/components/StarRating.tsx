import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

export function StarRating({
  rating,
  count,
  interactive = false,
  onRate,
  size = 16,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div
        style={{ display: 'inline-flex', gap: '2px' }}
        onMouseLeave={() => interactive && setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(displayRating);
          return (
            <span
              key={star}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : undefined}
              tabIndex={interactive ? 0 : undefined}
              onClick={() => interactive && onRate?.(star)}
              onMouseEnter={() => interactive && setHovered(star)}
              onKeyDown={(e) => {
                if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRate?.(star);
                }
              }}
              style={{
                fontSize: `${size}px`,
                color: filled ? '#E07A5F' : '#D4D2CF',
                cursor: interactive ? 'pointer' : 'default',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              ★
            </span>
          );
        })}
      </div>
      {count !== undefined && count > 0 && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(11, size - 4)}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
