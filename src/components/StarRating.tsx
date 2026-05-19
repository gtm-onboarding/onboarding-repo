import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  size?: number;
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
}

function StarIcon({ filled, half, size, color }: { filled: boolean; half: boolean; size: number; color: string }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <clipPath id="halfClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
          clipPath="url(#halfClip)"
        />
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  onRate,
  size = 20,
  showCount = false,
  count = 0,
  interactive = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating ?? 0;
  const starColor = '#E07A5F';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div
        style={{ display: 'flex', gap: '2px' }}
        onMouseLeave={() => interactive && setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive
            ? star <= displayRating
            : star <= Math.floor(displayRating);
          const half = !interactive && !filled && star === Math.ceil(displayRating) && displayRating % 1 >= 0.25;

          return (
            <span
              key={star}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
              tabIndex={interactive ? 0 : undefined}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                lineHeight: 0,
              }}
              onClick={() => interactive && onRate?.(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onKeyDown={(e) => {
                if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRate?.(star);
                }
              }}
            >
              <StarIcon filled={filled || half} half={half} size={size} color={starColor} />
            </span>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size * 0.65)}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
      {showCount && count === 0 && rating === null && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size * 0.65)}px`, marginLeft: '4px' }}>
          No ratings
        </span>
      )}
    </div>
  );
}
