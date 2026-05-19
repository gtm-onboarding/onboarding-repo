import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useTheme } from '../context/ThemeContext';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        style={{
          padding: '8px 14px',
          border: `1px solid ${activeTheme.colors.border}`,
          borderRadius: activeTheme.radii.sm,
          fontSize: '14px',
          width: '220px',
          backgroundColor: activeTheme.colors.surfaceAlt,
          color: activeTheme.colors.text,
          outline: 'none',
        }}
      />
      {isOpen && query.trim() && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: activeTheme.colors.surface,
            border: `1px solid ${activeTheme.colors.border}`,
            borderRadius: activeTheme.radii.sm,
            boxShadow: activeTheme.shadows.md,
            zIndex: 200,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: activeTheme.colors.text,
                fontSize: '14px',
                borderBottom: `1px solid ${activeTheme.colors.borderLight}`,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = activeTheme.colors.surfaceAlt)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>{product.name}</span>
              <span style={{ color: activeTheme.colors.primary, fontWeight: '600', fontSize: '13px' }}>
                ${product.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
