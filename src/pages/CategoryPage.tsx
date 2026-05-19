import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryMenu } from '../components/CategoryMenu';
import { useTheme } from '../context/ThemeContext';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const c = theme.colors;

  const categoryName = decodeURIComponent(categoryId || '');
  const categoryProducts = products.filter((p) => p.category === categoryName);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [categoryId]);

  return (
    <div style={{ backgroundColor: c.background, minHeight: '100vh', padding: '40px 32px' }}>
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
                fontFamily: theme.fonts.display,
                color: c.text,
                fontSize: '36px',
                fontWeight: '600',
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}
            >
              {categoryName}
            </h1>
            <p style={{ color: c.textMuted, fontSize: '15px' }}>
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
                    backgroundColor: c.surfaceAlt,
                    height: '360px',
                    borderRadius: '12px',
                  }}
                />
              ))}
            </div>
          ) : categoryProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: c.surface,
                boxShadow: theme.shadows.md,
                padding: '80px',
                textAlign: 'center',
                borderRadius: '12px',
              }}
            >
              <p style={{ color: c.textMuted, fontSize: '17px' }}>
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
