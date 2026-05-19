import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartIcon } from './icons/CartIcon';
import { UserIcon } from './icons/UserIcon';
import { SearchIcon } from './icons/SearchIcon';
import { categories } from '../data/products';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E8E6E3',
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(26, 26, 26, 0.04)',
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
              color: '#1A1A1A',
              fontSize: '26px',
              fontWeight: '600',
              fontFamily: '"Playfair Display", Georgia, serif',
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
                  color: '#6B6B6B',
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
          <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 16px 8px 40px',
                border: '1px solid #E8E6E3',
                borderRadius: '6px',
                fontSize: '14px',
                width: '220px',
                backgroundColor: '#FAF9F7',
                color: '#1A1A1A',
              }}
            />
          </form>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <UserIcon />
              <span style={{ color: '#6B6B6B', fontSize: '14px', fontWeight: '500' }}>{user?.email}</span>
              <button
                onClick={signOut}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #E8E6E3',
                  color: '#6B6B6B',
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
                color: '#1A1A1A',
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
              color: '#1A1A1A',
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
                  backgroundColor: '#E07A5F',
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
