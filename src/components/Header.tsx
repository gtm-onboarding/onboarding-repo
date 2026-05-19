import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CartIcon } from './icons/CartIcon';
import { UserIcon } from './icons/UserIcon';
import { categories } from '../data/products';
import { SearchBar } from './SearchBar';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const { activeTheme, mode, toggleTheme } = useTheme();

  return (
    <header
      style={{
        backgroundColor: activeTheme.colors.surface,
        borderBottom: `1px solid ${activeTheme.colors.border}`,
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: activeTheme.shadows.sm,
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
              color: activeTheme.colors.text,
              fontSize: '26px',
              fontWeight: '600',
              fontFamily: activeTheme.fonts.display,
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
                  color: activeTheme.colors.textSecondary,
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
        <SearchBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: '1',
            }}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <UserIcon />
              <span style={{ color: activeTheme.colors.textSecondary, fontSize: '14px', fontWeight: '500' }}>{user?.email}</span>
              <Link
                to="/orders"
                style={{
                  color: activeTheme.colors.textSecondary,
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                Orders
              </Link>
              <button
                onClick={signOut}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${activeTheme.colors.border}`,
                  color: activeTheme.colors.textSecondary,
                  padding: '8px 16px',
                  borderRadius: activeTheme.radii.sm,
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
                color: activeTheme.colors.text,
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
              color: activeTheme.colors.text,
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
                  backgroundColor: activeTheme.colors.primary,
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
