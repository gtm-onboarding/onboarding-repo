import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  userRating?: number | null;
  onRate?: (rating: number) => void;
  size?: number;
}

function StarIcon({ filled, half, size, color }: { filled: boolean; half: boolean; size: number; color: string }) {
  const emptyColor = '#D4D2CF';
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <clipPath id="halfClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill={color}
          clipPath="url(#halfClip)"
        />
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill={emptyColor}
          style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill={filled ? color : emptyColor}
      />
    </svg>
  );
}

export function StarRating({
  rating,
  count,
  interactive = false,
  userRating,
  onRate,
  size = 16,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || (interactive && userRating ? userRating : rating);
  const starColor = interactive && (hoverRating || userRating) ? '#E07A5F' : '#F4B942';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div
        style={{
          display: 'flex',
          gap: '2px',
          cursor: interactive ? 'pointer' : 'default',
        }}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(displayRating);
          const half = !filled && star === Math.ceil(displayRating) && displayRating % 1 >= 0.25;
          return (
            <span
              key={star}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onClick={() => interactive && onRate?.(star)}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
              style={{ display: 'inline-flex', lineHeight: 0 }}
            >
              <StarIcon
                filled={filled}
                half={!interactive && half}
                size={size}
                color={starColor}
              />
            </span>
          );
        })}
      </div>
      {count !== undefined && (
        <span
          style={{
            color: '#9A9A9A',
            fontSize: `${Math.max(11, size - 3)}px`,
            marginLeft: '2px',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
}
