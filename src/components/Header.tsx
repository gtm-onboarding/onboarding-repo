import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartIcon } from './icons/CartIcon';
import { UserIcon } from './icons/UserIcon';
import { SearchIcon } from './icons/SearchIcon';
import { categories, products } from '../data/products';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleResultClick(productId: string) {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  }

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
        <div ref={searchRef} style={{ position: 'relative', flex: '0 1 320px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #E8E6E3',
              borderRadius: '8px',
              padding: '8px 12px',
              backgroundColor: '#FAF9F7',
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                marginLeft: '8px',
                fontSize: '14px',
                color: '#1A1A1A',
                width: '100%',
              }}
            />
          </div>
          {isSearchOpen && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E6E3',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.08)',
                maxHeight: '320px',
                overflowY: 'auto',
                zIndex: 200,
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#1A1A1A',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#FAF9F7')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{product.name}</div>
                      <div style={{ color: '#6B6B6B', fontSize: '12px' }}>
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div
                  style={{
                    padding: '16px 12px',
                    color: '#6B6B6B',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
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
