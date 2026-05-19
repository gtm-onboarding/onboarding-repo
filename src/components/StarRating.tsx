interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

function Star({ fill, size }: { fill: 'full' | 'half' | 'empty'; size: number }) {
  const color = '#E07A5F';
  const emptyColor = '#D9D9D9';

  if (fill === 'full') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }

  if (fill === 'half') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <linearGradient id={`half-grad-${size}`}>
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor={emptyColor} />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#half-grad-${size})`}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={emptyColor}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarRating({ rating, count, size = 16 }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = rating - i;
    if (diff >= 0.75) return 'full' as const;
    if (diff >= 0.25) return 'half' as const;
    return 'empty' as const;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {stars.map((fill, i) => (
        <Star key={i} fill={fill} size={size} />
      ))}
      {count !== undefined && count > 0 && (
        <span style={{ marginLeft: '6px', color: '#6B6B6B', fontSize: `${size * 0.75}px` }}>
          ({count})
        </span>
      )}
    </div>
  );
}
