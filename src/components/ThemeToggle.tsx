import { useTheme } from '../context/ThemeContext';
import { theme as tokens } from '../theme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        backgroundColor: 'transparent',
        border: `1px solid ${tokens.colors.border}`,
        color: tokens.colors.text,
        width: '36px',
        height: '36px',
        borderRadius: tokens.radii.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
