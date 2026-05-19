import { useTheme } from '../../context/ThemeContext';

export function SearchIcon() {
  const { theme } = useTheme();
  const color = theme.colors.textSecondary;

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5"/>
      <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
