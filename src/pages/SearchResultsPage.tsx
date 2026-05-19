import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      if (q === '') {
        setResults([]);
      } else {
        const filtered = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        setResults(filtered);
      }
      setIsLoading(false);
    }, 300);
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
            Search Results
          </h1>
          <p style={{ color: '#9A9A9A', fontSize: '15px' }}>
            {query
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : 'Enter a search term to find products'}
          </p>
        </div>
        {isLoading ? (
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
        ) : results.length === 0 && query ? (
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
              No products found matching &ldquo;{query}&rdquo;
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
