import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';

const MAX_RESULTS = 6;

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products.filter((product) => product.name.toLowerCase().includes(term)).slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectProduct = (productId: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '260px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F5F3F0',
          border: '1px solid #E8E6E3',
          borderRadius: '6px',
          padding: '8px 12px',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onMouseDown={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
            if (e.key === 'Enter' && results.length > 0) selectProduct(results[0].id);
          }}
          placeholder="Search products"
          aria-label="Search products"
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
      {isOpen && query.trim() && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            listStyle: 'none',
            margin: 0,
            padding: '8px 0',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E6E3',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
            zIndex: 200,
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {results.length === 0 ? (
            <li style={{ padding: '10px 16px', color: '#9A9A9A', fontSize: '14px' }}>No products found</li>
          ) : (
            results.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => selectProduct(product.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    textAlign: 'left',
                  }}
                >
                  <span>{product.name}</span>
                  <span style={{ color: '#6B6B6B' }}>${product.price.toFixed(2)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
