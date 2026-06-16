import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
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

  function handleSelect(product: Product) {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
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
          width: '240px',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
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
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  width: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #F5F3F0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF9F7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
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
