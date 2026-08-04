import { useId, useState } from 'react';
import { MAX_RATING } from '../hooks/useRatings';

const STARS = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

const ACTIVE_COLOR = '#E0A75F';
const INACTIVE_COLOR = '#DAD6D0';

interface StarProps {
  clipId: string;
  filled: number;
  size: number;
}

function Star({ clipId, filled, size }: StarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={20 * filled} height="20" />
        </clipPath>
      </defs>
      <path
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85z"
        fill={INACTIVE_COLOR}
      />
      <path
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85z"
        fill={ACTIVE_COLOR}
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  onRate?: (rating: number) => void;
}

export function StarRating({ value, count, size = 16, onRate }: StarRatingProps) {
  const instanceId = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState<number | null>(null);
  const displayed = hovered ?? value;

  const stars = STARS.map((star) => {
    const filled = Math.min(1, Math.max(0, displayed - star + 1));
    const clipId = `star-clip-${instanceId}-${star}`;
    if (!onRate) {
      return <Star key={star} clipId={clipId} filled={filled} size={size} />;
    }
    return (
      <button
        key={star}
        type="button"
        aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
        onClick={() => onRate(star)}
        onMouseEnter={() => setHovered(star)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(star)}
        onBlur={() => setHovered(null)}
        style={{
          background: 'none',
          border: 'none',
          padding: '2px',
          lineHeight: 0,
          cursor: 'pointer',
        }}
      >
        <Star clipId={clipId} filled={filled} size={size} />
      </button>
    );
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        role={onRate ? undefined : 'img'}
        aria-label={onRate ? undefined : `Rated ${value.toFixed(1)} out of ${MAX_RATING} stars`}
        style={{ display: 'flex', alignItems: 'center', gap: onRate ? '0' : '2px' }}
      >
        {stars}
      </div>
      {count !== undefined && (
        <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size - 3)}px` }}>
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
