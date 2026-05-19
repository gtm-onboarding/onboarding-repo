import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (stars: number) => void;
  size?: number;
}

function StarIcon({ filled, half, size, color }: { filled: boolean; half: boolean; size: number; color: string }) {
  const emptyColor = '#D4D2CF';

  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <defs>
          <clipPath id="star-left-half">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
          <clipPath id="star-right-half">
            <rect x="12" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
          clipPath="url(#star-left-half)"
        />
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={emptyColor}
          clipPath="url(#star-right-half)"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : emptyColor}
      />
    </svg>
  );
}

export function StarRating({ rating, count, interactive = false, onRate, size = 18 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
  const starColor = '#E07A5F';

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(displayRating);
    const half = !filled && !interactive && i === Math.ceil(displayRating) && displayRating % 1 >= 0.25;

    stars.push(
      <span
        key={i}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? `Rate ${i} star${i > 1 ? 's' : ''}` : undefined}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          display: 'inline-flex',
          transition: 'transform 150ms ease',
          transform: interactive && hoverRating === i ? 'scale(1.2)' : 'scale(1)',
        }}
        onClick={interactive && onRate ? () => onRate(i) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      >
        <StarIcon filled={filled || half} half={half} size={size} color={starColor} />
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {stars}
      </span>
      {count !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 4)}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
    </span>
  );
}
