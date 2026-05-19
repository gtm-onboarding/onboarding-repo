import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { SearchIcon } from './icons/SearchIcon';
import { Product } from '../types';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results: Product[] = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
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
          backgroundColor: '#F5F4F2',
          borderRadius: '8px',
          padding: '8px 12px',
          gap: '8px',
          border: '1px solid #E8E6E3',
        }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            color: '#1A1A1A',
            width: '180px',
          }}
        />
      </div>
      {isOpen && results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E6E3',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(26, 26, 26, 0.08)',
            listStyle: 'none',
            padding: '4px 0',
            zIndex: 200,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {results.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#1A1A1A',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor = '#F5F4F2';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor = 'transparent';
              }}
            >
              <span>{product.name}</span>
              <span style={{ color: '#6B6B6B', fontSize: '13px' }}>
                ${product.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
