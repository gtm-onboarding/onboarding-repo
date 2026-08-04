export type ThemeName = 'light' | 'dark';

/**
 * Palette values live in App.css as `--color-*` / `--shadow-*` custom properties,
 * scoped per `:root[data-theme]`. Components consume the variables through these
 * tokens so a theme switch is a single attribute change on the document element.
 */
const colorTokens = [
  'background',
  'surface',
  'surfaceAlt',
  'text',
  'textSecondary',
  'textMuted',
  'primary',
  'primaryHover',
  'primaryContrast',
  'primarySurface',
  'success',
  'successSurface',
  'error',
  'errorSurface',
  'border',
  'borderLight',
  'overlay',
] as const;

const shadowTokens = ['sm', 'md', 'lg', 'xl'] as const;

export type ColorToken = (typeof colorTokens)[number];
export type ShadowToken = (typeof shadowTokens)[number];

function kebab(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function toVariables<T extends string>(tokens: readonly T[], prefix: string): Record<T, string> {
  return tokens.reduce(
    (acc, token) => ({ ...acc, [token]: `var(--${prefix}-${kebab(token)})` }),
    {} as Record<T, string>
  );
}

export const theme = {
  colors: toVariables(colorTokens, 'color'),
  shadows: toVariables(shadowTokens, 'shadow'),
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    body: '"DM Sans", -apple-system, sans-serif',
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },
};
