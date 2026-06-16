import { theme } from '../theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const bgColor = type === 'success' ? theme.colors.successLight : theme.colors.errorLight;
  const textColor = type === 'success' ? theme.colors.success : theme.colors.error;
  const iconBgColor = type === 'success' ? theme.colors.success : theme.colors.error;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
        backgroundColor: bgColor,
        color: textColor,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        borderRadius: theme.radii.lg,
        boxShadow: theme.shadows.lg,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        animation: 'slideUp 0.3s ease-out',
        fontWeight: theme.fontWeights.medium,
        fontSize: theme.fontSizes.base,
      }}
    >
      <span
        style={{
          width: theme.spacing.xl,
          height: theme.spacing.xl,
          borderRadius: theme.radii.full,
          backgroundColor: iconBgColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: theme.fontSizes.base,
          flexShrink: 0,
        }}
      >
        {type === 'success' ? '✓' : '!'}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: textColor,
          fontSize: theme.fontSizes.lg,
          cursor: 'pointer',
          padding: '0',
          lineHeight: '1',
          marginLeft: theme.spacing.sm,
          opacity: 0.7,
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
