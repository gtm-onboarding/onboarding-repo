import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const query = (searchParams.get('q') || '').trim();
  const results = searchProducts(query);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              fontSize: '36px',
              fontWeight: '600',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p style={{ color: '#9A9A9A', fontSize: '15px' }}>
              {results.length} {results.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>
        {!query ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              padding: '80px',
              textAlign: 'center',
              borderRadius: '12px',
            }}
          >
            <p style={{ color: '#9A9A9A', fontSize: '17px' }}>
              Enter a search term to find products
            </p>
          </div>
        ) : isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#F5F3F0',
                  height: '360px',
                  borderRadius: '12px',
                }}
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
              padding: '80px',
              textAlign: 'center',
              borderRadius: '12px',
            }}
          >
            <p style={{ color: '#9A9A9A', fontSize: '17px' }}>
              No products found for "{query}"
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
