# Theme System Documentation

## Overview

This application uses a comprehensive theme system to ensure visual consistency and maintainability. The theme is defined in `src/theme.ts` and provides design tokens for colors, typography, spacing, and more.

## Theme Structure

### Colors (`theme.colors`)

```typescript
theme.colors.background    // Main background color
theme.colors.surface       // Card/surface backgrounds
theme.colors.surfaceAlt    // Alternative surface color
theme.colors.text          // Primary text color
theme.colors.textSecondary // Secondary text color
theme.colors.textMuted     // Muted text color
theme.colors.primary       // Primary brand color
theme.colors.primaryHover  // Primary hover state
theme.colors.success       // Success state color
theme.colors.successLight  // Success background
theme.colors.error         // Error state color
theme.colors.errorLight    // Error background
theme.colors.border        // Border color
theme.colors.borderLight   // Light border color
```

### Typography (`theme.fonts`, `theme.fontSizes`, `theme.fontWeights`, `theme.lineHeights`, `theme.letterSpacing`)

```typescript
// Font families
theme.fonts.display  // Display/headings font
theme.fonts.body     // Body text font

// Font sizes
theme.fontSizes.xs   // 11px
theme.fontSizes.sm   // 13px
theme.fontSizes.base // 14px
theme.fontSizes.md   // 17px
theme.fontSizes.lg   // 20px
theme.fontSizes.xl   // 26px

// Font weights
theme.fontWeights.normal    // 400
theme.fontWeights.medium    // 500
theme.fontWeights.semibold  // 600
theme.fontWeights.bold      // 700

// Line heights
theme.lineHeights.tight    // 1.2
theme.lineHeights.normal   // 1.5
theme.lineHeights.relaxed  // 1.6

// Letter spacing
theme.letterSpacing.tight  // -0.5px
theme.letterSpacing.normal // 0px
theme.letterSpacing.wide   // 0.3px
```

### Spacing (`theme.spacing`)

```typescript
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 16px
theme.spacing.lg   // 20px
theme.spacing.xl   // 24px
theme.spacing['2xl'] // 32px
theme.spacing['3xl'] // 48px
```

### Effects (`theme.shadows`, `theme.radii`, `theme.transitions`)

```typescript
// Shadows
theme.shadows.sm // Small shadow
theme.shadows.md // Medium shadow
theme.shadows.lg // Large shadow
theme.shadows.xl // Extra large shadow

// Border radius
theme.radii.sm   // 6px
theme.radii.md   // 12px
theme.radii.lg   // 16px
theme.radii.xl   // 24px
theme.radii.full // 9999px (fully rounded)

// Transitions
theme.transitions.fast   // 150ms ease
theme.transitions.normal // 250ms ease
theme.transitions.slow   // 400ms ease
```

### Z-Index (`theme.zIndex`)

```typescript
theme.zIndex.dropdown // 100
theme.zIndex.sticky   // 100
theme.zIndex.modal    // 1000
theme.zIndex.tooltip  // 1100
```

## Usage Examples

### Basic Component Styling

```typescript
import { theme } from '../theme';

export function MyComponent() {
  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      boxShadow: theme.shadows.md,
    }}>
      <h2 style={{
        fontFamily: theme.fonts.display,
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
      }}>
        Heading
      </h2>
      <p style={{
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.base,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.normal,
      }}>
        Body text
      </p>
    </div>
  );
}
```

### Using Theme Utilities

The `src/utils/theme.ts` file provides helper functions for common patterns:

```typescript
import { 
  flexCenter, 
  spacing, 
  fontSize, 
  fontWeight, 
  textColor,
  backgroundColor,
  borderRadius,
  shadow
} from '../utils/theme';

export function MyComponent() {
  return (
    <div style={{
      ...flexCenter,
      ...backgroundColor('surface'),
      ...spacing('padding', 'md'),
      ...borderRadius('md'),
      ...shadow('md'),
    }}>
      <span style={{
        ...fontSize('base'),
        ...fontWeight('medium'),
        ...textColor('text'),
      }}>
        Content
      </span>
    </div>
  );
}
```

### Conditional Styling

```typescript
export function StatusBadge({ status }: { status: 'success' | 'error' }) {
  const bgColor = status === 'success' 
    ? theme.colors.successLight 
    : theme.colors.errorLight;
  const textColor = status === 'success' 
    ? theme.colors.success 
    : theme.colors.error;

  return (
    <div style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.radii.sm,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
    }}>
      {status}
    </div>
  );
}
```

## Best Practices

1. **Always use theme tokens** - Avoid hardcoded values in styling
2. **Import from theme** - Use `import { theme } from '../theme'` in components
3. **Use semantic names** - Choose token names that describe their purpose, not their appearance
4. **Consider utilities** - For complex patterns, use the utility functions from `src/utils/theme.ts`
5. **Maintain consistency** - Use the same tokens for similar UI elements across the application

## Adding New Tokens

When adding new design tokens to `theme.ts`:

1. Follow the existing naming conventions
2. Use semantic, descriptive names
3. Group related tokens together
4. Update this documentation when adding new token categories
5. Consider backward compatibility when modifying existing tokens

## Future Components

When creating new components:

1. Start by checking if existing tokens meet your needs
2. If new tokens are needed, add them to `theme.ts` rather than hardcoding values
3. Use theme utilities for common patterns
4. Document any component-specific styling decisions
5. Ensure responsive design uses the breakpoint system from `src/utils/theme.ts`

## Migration Notes

Components that have been migrated to use theme constants:
- ✅ `Toast.tsx`
- ✅ `ProductCard.tsx`
- ✅ `Header.tsx`

Components that still need migration:
- ⏳ `CartItem.tsx`
- ⏳ `CategoryMenu.tsx`
- ⏳ Icon components

## Type Safety

The theme system provides full TypeScript support. All theme properties are type-safe, and you'll get autocomplete and type checking when using theme tokens.