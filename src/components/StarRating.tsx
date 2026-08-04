import { useState } from 'react';
import { StarIcon } from './icons/StarIcon';
import { useRatings } from '../context/RatingsContext';

interface StarRatingProps {
  productId: string;
  interactive?: boolean;
  size?: number;
  showCount?: boolean;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({
  productId,
  interactive = false,
  size = 18,
  showCount = true,
}: StarRatingProps) {
  const { rateProduct, getAverageRating, getRatingCount } = useRatings();
  const [hoveredRating, setHoveredRating] = useState(0);

  const average = getAverageRating(productId);
  const count = getRatingCount(productId);
  const displayedValue = interactive && hoveredRating > 0 ? hoveredRating : average;

  const fillPercentFor = (star: number) =>
    Math.min(100, Math.max(0, (displayedValue - (star - 1)) * 100));

  if (!interactive && count === 0) {
    return (
      <span style={{ color: '#9A9A9A', fontSize: `${Math.max(12, size * 0.75)}px` }}>
        No ratings yet
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
        role={interactive ? 'group' : 'img'}
        aria-label={
          interactive
            ? 'Rate this product'
            : `Average rating ${average.toFixed(1)} out of 5 from ${count} ratings`
        }
      >
        {STARS.map((star) =>
          interactive ? (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
              onClick={() => rateProduct(productId, star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                lineHeight: 0,
                cursor: 'pointer',
              }}
            >
              <StarIcon size={size} fillPercent={fillPercentFor(star)} />
            </button>
          ) : (
            <StarIcon key={star} size={size} fillPercent={fillPercentFor(star)} />
          )
        )}
      </div>
      {showCount && (
        <span
          style={{
            color: count === 0 ? '#9A9A9A' : '#6B6B6B',
            fontSize: `${Math.max(12, size * 0.75)}px`,
            fontWeight: '500',
          }}
        >
          {count === 0 ? 'No ratings yet' : `${average.toFixed(1)} (${count})`}
        </span>
      )}
    </div>
  );
}
