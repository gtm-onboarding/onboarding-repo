import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { theme } from '../theme';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results: Product[] =
    query.trim().length > 0
      ? products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  function selectProduct(product: Product) {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectProduct(results[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radii.sm,
          padding: '8px 12px',
          gap: '8px',
          width: '240px',
          transition: theme.transitions.fast,
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
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
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '14px',
            color: theme.colors.text,
            width: '100%',
          }}
        />
      </div>
      {isOpen && query.trim().length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.sm,
            boxShadow: theme.shadows.lg,
            border: `1px solid ${theme.colors.border}`,
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 200,
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: '16px',
                color: theme.colors.textMuted,
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              No products found
            </div>
          ) : (
            results.map((product, index) => (
              <button
                key={product.id}
                onClick={() => selectProduct(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor:
                    index === highlightedIndex
                      ? theme.colors.surfaceAlt
                      : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme.colors.text,
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.colors.primary,
                      fontWeight: '600',
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
