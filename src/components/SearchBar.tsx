import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: Product[] =
    query.length >= 1
      ? products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const selectProduct = useCallback(
    (product: Product) => {
      setQuery('');
      setIsOpen(false);
      setActiveIndex(-1);
      navigate(`/product/${product.id}`);
    },
    [navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectProduct(results[activeIndex]);
        } else if (results.length > 0) {
          selectProduct(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '280px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F5F3F0',
          borderRadius: '6px',
          padding: '8px 12px',
          border: '1px solid #E8E6E3',
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
          onFocus={() => {
            if (query.length >= 1) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          aria-label="Search products"
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '100%',
            fontFamily: '"DM Sans", -apple-system, sans-serif',
          }}
        />
      </div>
      {isOpen && query.length >= 1 && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            border: '1px solid #E8E6E3',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
            zIndex: 200,
            maxHeight: '320px',
            overflowY: 'auto',
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
              No results found
            </div>
          ) : (
            results.map((product, index) => (
              <div
                key={product.id}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={() => selectProduct(product)}
                onMouseEnter={() => setActiveIndex(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  backgroundColor: index === activeIndex ? '#F5F3F0' : 'transparent',
                  borderBottom: index < results.length - 1 ? '1px solid #F0EEEB' : 'none',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: '#1A1A1A',
                      fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ color: '#6B6B6B', fontSize: '13px' }}>
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
