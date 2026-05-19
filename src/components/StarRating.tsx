import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  userRating?: number | null;
  onRate?: (rating: number) => void;
  size?: number;
}

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
const STAR_LEFT_HALF = 'M12 2L8.91 8.26 2 9.27 7 14.14 5.82 21.02 12 17.77Z';

function StarIcon({ filled, half, size, color }: { filled: boolean; half: boolean; size: number; color: string }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d={STAR_PATH} fill="none" stroke={color} strokeWidth="1.5" />
        <path d={STAR_LEFT_HALF} fill={color} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5">
      <path d={STAR_PATH} />
    </svg>
  );
}

export function StarRating({
  rating,
  count,
  interactive = false,
  userRating,
  onRate,
  size = 18,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const displayRating = hoverRating || (interactive && userRating ? userRating : rating);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{ display: 'flex', gap: '2px' }}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(displayRating);
          const half = !filled && star === Math.ceil(displayRating) && displayRating % 1 >= 0.25;

          return (
            <span
              key={star}
              onClick={() => interactive && onRate?.(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                transition: 'transform 150ms ease',
                transform: interactive && hoverRating === star ? 'scale(1.2)' : 'scale(1)',
              }}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : undefined}
            >
              <StarIcon
                filled={filled || half}
                half={half && !filled}
                size={size}
                color={filled || half ? '#E07A5F' : '#D1CFC9'}
              />
            </span>
          );
        })}
      </div>
      {count !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(11, size - 4)}px` }}>
          {rating.toFixed(1)} ({count})
        </span>
      )}
      {interactive && userRating !== null && userRating !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: '13px', marginLeft: '4px' }}>
          Your rating: {userRating}/5
        </span>
      )}
    </div>
  );
}
