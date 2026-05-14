interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: type === 'success' ? '#E8F5E9' : '#FEF2F2',
        color: type === 'success' ? '#4A7C59' : '#C44536',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(26, 26, 26, 0.12)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: 'slideUp 0.3s ease-out',
        fontWeight: '500',
        fontSize: '14px',
      }}
    >
      <span
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: type === 'success' ? '#4A7C59' : '#C44536',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
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
          color: type === 'success' ? '#4A7C59' : '#C44536',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0',
          lineHeight: '1',
          marginLeft: '8px',
          opacity: 0.7,
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
