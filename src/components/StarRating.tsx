import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onRate?: (rating: number) => void;
  size?: number;
}

export function StarRating({ rating, maxStars = 5, onRate, size = 20 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const { activeTheme } = useTheme();
  const isInteractive = !!onRate;
  const displayRating = hoverRating || rating;

  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = displayRating >= starValue;
        const halfFilled = !filled && displayRating >= starValue - 0.5;

        return (
          <span
            key={i}
            onClick={isInteractive ? () => onRate(starValue) : undefined}
            onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
            onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
            style={{
              cursor: isInteractive ? 'pointer' : 'default',
              fontSize: `${size}px`,
              color: filled || halfFilled ? activeTheme.colors.primary : activeTheme.colors.borderLight,
              userSelect: 'none',
              lineHeight: '1',
            }}
          >
            {filled ? '\u2605' : halfFilled ? '\u2605' : '\u2606'}
          </span>
        );
      })}
    </div>
  );
}
