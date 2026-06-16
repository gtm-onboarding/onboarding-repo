import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (product: Product) => {
      setQuery('');
      setIsOpen(false);
      setActiveIndex(-1);
      navigate(`/product/${product.id}`);
    },
    [navigate]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

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
          width: '240px',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-results-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          role="combobox"
          aria-autocomplete="list"
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '100%',
          }}
        />
      </div>
      {isOpen && (
        <div
          ref={listRef}
          id="search-results-listbox"
          role="listbox"
          aria-label="Search results"
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
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 200,
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
            results.map((product, index) => (
              <button
                key={product.id}
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => handleSelect(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  width: '100%',
                  border: 'none',
                  backgroundColor: index === activeIndex ? '#FAF9F7' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #F5F3F0',
                }}
                onMouseEnter={(e) => {
                  setActiveIndex(index);
                  e.currentTarget.style.backgroundColor = '#FAF9F7';
                }}
                onMouseLeave={(e) => {
                  if (index !== activeIndex) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
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
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9A9A9A' }}>
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
