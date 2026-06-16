import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { theme } from '../theme';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof products>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    setResults(filtered);
    setShowDropdown(true);
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectProduct(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectProduct = (product: typeof products[0]) => {
    navigate(`/product/${product.id}`);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '300px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radii.sm,
          padding: '8px 12px',
          gap: '8px',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query) setShowDropdown(true); }}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            flex: 1,
            backgroundColor: 'transparent',
            color: theme.colors.text,
          }}
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            marginTop: '4px',
            boxShadow: theme.shadows.md,
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {results.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? theme.colors.primary + '10' : 'transparent',
                borderBottom: index < results.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.text }}>
                {product.name}
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                {product.category} • ${product.price}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && query && results.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            marginTop: '4px',
            padding: '12px',
            fontSize: '14px',
            color: theme.colors.textSecondary,
            boxShadow: theme.shadows.md,
            zIndex: 1000,
          }}
        >
          No products found
        </div>
      )}
    </div>
  );
}
