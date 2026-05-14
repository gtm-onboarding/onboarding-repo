import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryMenu } from '../components/CategoryMenu';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const categoryName = decodeURIComponent(categoryId || '');
  const categoryProducts = products.filter((p) => p.category === categoryName);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [categoryId]);

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '40px',
        }}
      >
        <aside>
          <CategoryMenu activeCategory={categoryName} />
        </aside>
        <main>
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
              {categoryName}
            </h1>
            <p style={{ color: '#9A9A9A', fontSize: '15px' }}>
              {categoryProducts.length} products available
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
          ) : categoryProducts.length === 0 ? (
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
                No products found in this category
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
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
