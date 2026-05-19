import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results: Product[] =
    query.trim().length > 0
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

  function selectProduct(product: Product) {
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search products..."
          aria-label="Search products"
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '100%',
          }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(26, 26, 26, 0.12)',
            listStyle: 'none',
            padding: '4px 0',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 200,
          }}
        >
          {results.map((product) => (
            <li
              key={product.id}
              role="option"
              onClick={() => selectProduct(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'background-color 150ms',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#F5F3F0')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
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
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A1A1A',
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#9A9A9A',
                  }}
                >
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
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
            padding: '16px 12px',
            fontSize: '14px',
            color: '#9A9A9A',
            zIndex: 200,
          }}
        >
          No products found
        </div>
      )}
    </div>
  );
}
