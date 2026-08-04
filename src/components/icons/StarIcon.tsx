interface StarIconProps {
  filled: boolean;
  size?: number;
}

export function StarIcon({ filled, size = 18 }: StarIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? '#E07A5F' : 'none'}
        stroke={filled ? '#E07A5F' : '#D6D2CC'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
