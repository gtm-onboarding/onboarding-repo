import { useState } from 'react';

interface StarRatingInputProps {
  currentRating: number | null;
  onRate: (rating: number) => void;
}

export function StarRatingInput({ currentRating, onRate }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? currentRating ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '15px' }}>
        {currentRating ? 'Your rating:' : 'Rate this product:'}
      </span>
      <div
        style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill={star <= displayRating ? '#E07A5F' : '#D9D9D9'}
            style={{ transition: 'fill 150ms ease, transform 150ms ease', transform: star <= (hovered ?? 0) ? 'scale(1.1)' : 'scale(1)' }}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onRate(star)}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      {currentRating && (
        <span style={{ color: '#6B6B6B', fontSize: '13px' }}>
          You rated this {currentRating} out of 5
        </span>
      )}
    </div>
  );
}
