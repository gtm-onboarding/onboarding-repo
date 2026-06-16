import { useState } from 'react';
import { theme } from '../theme';

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

function StarIcon({
  filled,
  size,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive,
}: {
  filled: boolean;
  size: number;
  hovered: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  interactive: boolean;
}) {
  const color = filled || hovered ? theme.colors.primary : theme.colors.border;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled || hovered ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: interactive ? 'pointer' : 'default', transition: theme.transitions.fast }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function StarRating({ rating, count, interactive = false, onRate, size = 16 }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            size={size}
            filled={star <= Math.round(rating)}
            hovered={interactive && star <= hoveredStar}
            interactive={interactive}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
      {count !== undefined && count > 0 && (
        <span
          style={{
            fontSize: size === 16 ? '12px' : '14px',
            color: theme.colors.textMuted,
            fontWeight: '500',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
}
