import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';

const MAX_RESULTS = 6;

function findProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return products
    .filter((product) => product.name.toLowerCase().includes(normalized))
    .slice(0, MAX_RESULTS);
}

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = findProducts(query);

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
    setHighlightedIndex(0);
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      selectProduct(results[highlightedIndex] ?? results[0]);
    }
  };

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '280px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#F5F3F0',
          border: '1px solid #E8E6E3',
          borderRadius: '6px',
          padding: '9px 14px',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-activedescendant={
            showDropdown && results.length ? `search-result-${results[highlightedIndex]?.id}` : undefined
          }
          placeholder="Search products"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
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
          id="search-results"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            listStyle: 'none',
            margin: 0,
            padding: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E6E3',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
            zIndex: 200,
          }}
        >
          {results.length === 0 ? (
            <li role="none" style={{ padding: '12px 14px', color: '#9A9A9A', fontSize: '14px' }}>
              No products found
            </li>
          ) : (
            results.map((product, index) => (
              <li key={product.id} role="none">
                <button
                  id={`search-result-${product.id}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectProduct(product)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: index === highlightedIndex ? '#FEF6F4' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <span style={{ flex: 1, color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
                    {product.name}
                  </span>
                  <span style={{ color: '#E07A5F', fontSize: '14px', fontWeight: '600' }}>
                    ${product.price.toFixed(2)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
