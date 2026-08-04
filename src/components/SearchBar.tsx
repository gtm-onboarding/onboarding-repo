import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

const MAX_RESULTS = 6;

function searchProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return products
    .filter((product) => product.name.toLowerCase().includes(normalized))
    .slice(0, MAX_RESULTS);
}

export function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const results = searchProducts(query);
  const showDropdown = isOpen && query.trim().length > 0;

  useEffect(() => {
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectProduct = (product: Product) => {
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    if (!showDropdown || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectProduct(results[highlightedIndex >= 0 ? highlightedIndex : 0]);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '260px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #E8E6E3',
          borderRadius: '6px',
          padding: '8px 12px',
          backgroundColor: '#FAF9F7',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          role="searchbox"
          aria-label="Search products"
          placeholder="Search products"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: '#1A1A1A',
            fontSize: '14px',
            width: '100%',
          }}
        />
      </div>
      {showDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E6E3',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
            listStyle: 'none',
            margin: 0,
            padding: '4px',
            zIndex: 200,
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {results.length === 0 ? (
            <li style={{ color: '#9A9A9A', fontSize: '14px', padding: '12px' }}>No products found</li>
          ) : (
            results.map((product, index) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => selectProduct(product)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    backgroundColor: highlightedIndex === index ? '#F5F3F0' : 'transparent',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <span style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500', flex: 1 }}>
                    {product.name}
                  </span>
                  <span style={{ color: '#6B6B6B', fontSize: '13px' }}>${product.price.toFixed(2)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
