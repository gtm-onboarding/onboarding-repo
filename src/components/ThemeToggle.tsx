import { useTheme } from '../context/ThemeContext';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
