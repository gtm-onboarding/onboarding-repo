import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CartIcon } from './icons/CartIcon';
import { UserIcon } from './icons/UserIcon';
import { ThemeToggleIcon } from './icons/ThemeToggleIcon';
import { categories } from '../data/products';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, mode, toggleTheme } = useTheme();
  const { colors, shadows } = theme;

  return (
    <header
      style={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: shadows.sm,
        transition: 'background-color 250ms ease, border-color 250ms ease',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <Link
            to="/"
            style={{
              color: colors.text,
              fontSize: '26px',
              fontWeight: '600',
              fontFamily: theme.fonts.display,
              letterSpacing: '-0.5px',
            }}
          >
            Onboarding Shop
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                style={{
                  color: colors.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.3px',
                  position: 'relative',
                  paddingBottom: '2px',
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.text,
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemeToggleIcon mode={mode} />
          </button>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: colors.text }}><UserIcon /></span>
              <span style={{ color: colors.textSecondary, fontSize: '14px', fontWeight: '500' }}>{user?.email}</span>
              <button
                onClick={signOut}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              style={{
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              <UserIcon />
              <span>Sign In</span>
            </Link>
          )}
          <Link
            to="/cart"
            style={{
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
