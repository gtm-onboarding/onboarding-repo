import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartIcon } from './icons/CartIcon';
import { UserIcon } from './icons/UserIcon';
import { categories } from '../data/products';
import { theme } from '../theme';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header
      style={{
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.sticky,
        boxShadow: theme.shadows.sm,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing['3xl'] }}>
          <Link
            to="/"
            style={{
              color: theme.colors.text,
              fontSize: '26px',
              fontWeight: theme.fontWeights.semibold,
              fontFamily: theme.fonts.display,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Onboarding Shop
          </Link>
          <div style={{ display: 'flex', gap: theme.spacing['2xl'] }}>
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontWeights.medium,
                  letterSpacing: theme.letterSpacing.wide,
                  position: 'relative',
                  paddingBottom: '2px',
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xl }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <UserIcon />
              <span style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.fontSizes.base, 
                fontWeight: theme.fontWeights.medium 
              }}>
                {user?.email}
              </span>
              <button
                onClick={signOut}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textSecondary,
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontWeights.medium,
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              style={{
                color: theme.colors.text,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                fontSize: theme.fontSizes.base,
                fontWeight: theme.fontWeights.medium,
              }}
            >
              <UserIcon />
              <span>Sign In</span>
            </Link>
          )}
          <Link
            to="/cart"
            style={{
              color: theme.colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              position: 'relative',
            }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  fontSize: theme.fontSizes.xs,
                  fontWeight: theme.fontWeights.semibold,
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
