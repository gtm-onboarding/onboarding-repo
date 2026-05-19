import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Product } from '../types';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results: Product[] =
    query.trim().length > 0
      ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      : [];

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectProduct(product: Product) {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
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
          backgroundColor: '#F5F3F0',
          borderRadius: '8px',
          padding: '8px 12px',
          gap: '8px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '180px',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(26, 26, 26, 0.12)',
            border: '1px solid #E8E6E3',
            zIndex: 200,
            maxHeight: '320px',
            overflowY: 'auto',
            minWidth: '280px',
          }}
        >
          {results.map((product, index) => (
            <button
              key={product.id}
              onClick={() => selectProduct(product)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                width: '100%',
                border: 'none',
                backgroundColor: index === highlightedIndex ? '#F5F3F0' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '12px', color: '#9A9A9A' }}>
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(26, 26, 26, 0.12)',
            border: '1px solid #E8E6E3',
            zIndex: 200,
            padding: '16px',
            minWidth: '280px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#9A9A9A', textAlign: 'center', margin: 0 }}>
            No products found
          </p>
        </div>
      )}
    </div>
  );
}
