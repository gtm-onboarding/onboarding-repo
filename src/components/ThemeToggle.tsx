import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        lineHeight: 1,
        color: 'var(--color-text-primary)',
      }}
    >
      {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
    </button>
  );
}
