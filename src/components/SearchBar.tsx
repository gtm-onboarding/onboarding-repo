import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results: Product[] = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(product: Product) {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
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
          gap: '8px',
          backgroundColor: '#F5F3F0',
          borderRadius: '8px',
          padding: '8px 12px',
          border: '1px solid transparent',
          transition: 'border-color 150ms ease',
          ...(isOpen ? { borderColor: '#E8E6E3' } : {}),
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '180px',
            fontFamily: '"DM Sans", -apple-system, sans-serif',
          }}
        />
      </div>

      {isOpen && query.trim() && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
            border: '1px solid #E8E6E3',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 200,
            minWidth: '260px',
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: '16px',
                color: '#9A9A9A',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              No products found
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
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
                  fontFamily: '"DM Sans", -apple-system, sans-serif',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#F5F3F0')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <div style={{ color: '#1A1A1A', fontWeight: '500' }}>
                    {product.name}
                  </div>
                  <div
                    style={{
                      color: '#9A9A9A',
                      fontSize: '12px',
                      marginTop: '2px',
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
