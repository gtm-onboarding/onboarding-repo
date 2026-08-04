import { useTheme } from '../context/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const label = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={mode === 'dark'}
      title={label}
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
        padding: 0,
      }}
    >
      {mode === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
