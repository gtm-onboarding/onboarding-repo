import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onRate?: (rating: number) => void;
  size?: number;
}

export function StarRating({ value, onRate, size = 20 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = Math.round(hoverValue ?? value);
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
      onMouseLeave={onRate ? () => setHoverValue(null) : undefined}
      aria-label={`${displayValue} out of 5 stars`}
    >
      {stars.map((star) => {
        const starContent = star <= displayValue ? '★' : '☆';
        const starStyle = {
          color: star <= displayValue ? '#E07A5F' : '#E8E6E3',
          fontSize: `${size}px`,
          lineHeight: 1,
        };

        if (!onRate) {
          return (
            <span key={star} style={starStyle} aria-hidden="true">
              {starContent}
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} stars`}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoverValue(star)}
            style={{ ...starStyle, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {starContent}
          </button>
        );
      })}
    </div>
  );
}
