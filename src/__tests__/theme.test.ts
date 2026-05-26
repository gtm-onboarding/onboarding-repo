import { describe, it, expect } from 'vitest';
import { theme } from '../theme';

describe('theme', () => {
  it('exports color values', () => {
    expect(theme.colors.primary).toBe('#E07A5F');
    expect(theme.colors.background).toBe('#FAF9F7');
    expect(theme.colors.text).toBe('#1A1A1A');
    expect(theme.colors.error).toBe('#C44536');
    expect(theme.colors.success).toBe('#4A7C59');
  });

  it('exports font families', () => {
    expect(theme.fonts.display).toContain('Playfair Display');
    expect(theme.fonts.body).toContain('DM Sans');
  });

  it('exports shadows', () => {
    expect(theme.shadows.sm).toBeDefined();
    expect(theme.shadows.md).toBeDefined();
    expect(theme.shadows.lg).toBeDefined();
    expect(theme.shadows.xl).toBeDefined();
  });

  it('exports border radii', () => {
    expect(theme.radii.sm).toBe('6px');
    expect(theme.radii.md).toBe('12px');
    expect(theme.radii.lg).toBe('16px');
    expect(theme.radii.xl).toBe('24px');
  });

  it('exports transitions', () => {
    expect(theme.transitions.fast).toBe('150ms ease');
    expect(theme.transitions.normal).toBe('250ms ease');
    expect(theme.transitions.slow).toBe('400ms ease');
  });
});
