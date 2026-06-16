import { useState, useId } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

function StarIcon({ filled, half, size, color, clipId }: { filled: boolean; half: boolean; size: number; color: string; clipId: string }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
          clipPath={`url(#${clipId})`}
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StarRating({ rating, count, interactive = false, onRate, size = 18 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const baseId = useId();
  const starColor = '#F4A261';
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(displayRating);
    const half = !filled && i === Math.ceil(displayRating) && displayRating % 1 >= 0.25;

    stars.push(
      <span
        key={i}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        onClick={interactive && onRate ? () => onRate(i) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        data-testid={`star-${i}`}
      >
        <StarIcon filled={filled} half={half} size={size} color={starColor} clipId={`${baseId}-half-${i}`} />
      </span>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
        {stars}
      </div>
      {count !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 4)}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
