import { useId } from 'react';

interface StarIconProps {
  size?: number;
  fillPercent?: number;
  color?: string;
  emptyColor?: string;
}

const STAR_PATH =
  'M12 2L14.9 8.62L22 9.38L16.7 14.02L18.2 21L12 17.36L5.8 21L7.3 14.02L2 9.38L9.1 8.62L12 2Z';

export function StarIcon({
  size = 22,
  fillPercent = 0,
  color = '#E07A5F',
  emptyColor = '#E8E6E3',
}: StarIconProps) {
  const gradientId = useId();
  const clamped = Math.min(100, Math.max(0, fillPercent));

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${clamped}%`} stopColor={color} />
          <stop offset={`${clamped}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d={STAR_PATH}
        fill={clamped === 0 ? 'transparent' : `url(#${gradientId})`}
        stroke={clamped === 100 ? color : emptyColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
