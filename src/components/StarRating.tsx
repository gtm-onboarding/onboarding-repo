import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  onRate?: (stars: number) => void;
  emptyLabel?: string;
}

export function StarRating({ value, count = 0, size = 18, onRate, emptyLabel }: StarRatingProps) {
  const filledStars = Math.round(value);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {stars.map((star) =>
          onRate ? (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <StarIcon filled={star <= filledStars} size={size} />
            </button>
          ) : (
            <StarIcon key={star} filled={star <= filledStars} size={size} />
          )
        )}
      </div>
      <span style={{ color: '#9A9A9A', fontSize: '13px', fontWeight: '500' }}>
        {count > 0 ? `${value.toFixed(1)} (${count})` : emptyLabel ?? 'No ratings yet'}
      </span>
    </div>
  );
}
