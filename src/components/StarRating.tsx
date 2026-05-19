import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  onRate?: (value: number) => void;
  size?: number;
  showCount?: boolean;
  count?: number;
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
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StarRating({ rating, onRate, size = 20, showCount = false, count = 0 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const interactive = !!onRate;
  const displayValue = hoverValue ?? rating ?? 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div
        style={{ display: 'flex', gap: '2px' }}
        onMouseLeave={() => interactive && setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive ? displayValue >= star : displayValue >= star;
          const half = !interactive && !filled && displayValue >= star - 0.5;

          return (
            <span
              key={star}
              onClick={() => onRate?.(star)}
              onMouseEnter={() => interactive && setHoverValue(star)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                transition: 'transform 150ms ease',
                transform: interactive && hoverValue === star ? 'scale(1.2)' : 'scale(1)',
              }}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : undefined}
              data-testid={`star-${star}`}
            >
              <StarIcon
                filled={filled}
                half={half}
                size={size}
                color="#E07A5F"
              />
            </span>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 4)}px`, marginLeft: '4px' }}>
          ({count})
        </span>
      )}
      {showCount && count === 0 && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 4)}px`, marginLeft: '4px' }}>
          No ratings
        </span>
      )}
    </div>
  );
}
