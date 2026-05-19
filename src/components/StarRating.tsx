import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

function StarIcon({ filled, half, size, color }: { filled: boolean; half: boolean; size: number; color: string }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="halfClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={color}
          clipPath="url(#halfClip)"
        />
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({ rating, count, interactive = false, onRate, size = 18 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const displayRating = hoverRating || rating || 0;
  const starColor = '#E07A5F';

  if (interactive) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate?.(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <StarIcon filled={star <= displayRating} half={false} size={size} color={starColor} />
            </button>
          ))}
        </div>
        {count !== undefined && count > 0 && (
          <span style={{ color: '#9A9A9A', fontSize: '13px', marginLeft: '4px' }}>
            ({count})
          </span>
        )}
      </div>
    );
  }

  if (rating === null) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '1px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(displayRating);
          const half = !filled && star === Math.ceil(displayRating) && displayRating % 1 >= 0.25;
          return (
            <StarIcon key={star} filled={filled} half={half} size={size} color={starColor} />
          );
        })}
      </div>
      <span style={{ color: '#6B6B6B', fontSize: '13px', fontWeight: '500', marginLeft: '2px' }}>
        {displayRating.toFixed(1)}
      </span>
      {count !== undefined && count > 0 && (
        <span style={{ color: '#9A9A9A', fontSize: '13px' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
