import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <main style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <section
        style={{
          backgroundColor: '#F5F3F0',
          padding: '80px 32px 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <p
              style={{
                color: '#E07A5F',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              New Collection
            </p>
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '56px',
                fontWeight: '600',
                color: '#1A1A1A',
                lineHeight: '1.1',
                marginBottom: '24px',
                letterSpacing: '-1px',
              }}
            >
              Discover Your
              <br />
              Perfect Style
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: '#6B6B6B',
                lineHeight: '1.7',
                marginBottom: '40px',
                maxWidth: '440px',
              }}
            >
              Curated collections of premium products designed for modern living.
              Quality craftsmanship meets timeless design.
            </p>
            <Link
              to="/category/Electronics"
              style={{
                backgroundColor: '#E07A5F',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '15px',
                display: 'inline-block',
                letterSpacing: '0.5px',
              }}
            >
              Shop Now
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              animation: 'slideUp 0.8s ease-out',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
                transform: 'translateY(-20px)',
              }}
            >
              <img
                src="https://picsum.photos/seed/hero1/300/300"
                alt="Featured"
                style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '14px' }}>Electronics</p>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
                transform: 'translateY(20px)',
              }}
            >
              <img
                src="https://picsum.photos/seed/hero2/300/300"
                alt="Featured"
                style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
              />
              <p style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '14px' }}>Home & Garden</p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '80px 32px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              fontSize: '36px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            Featured Products
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '16px' }}>
            Handpicked selections for discerning tastes
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '80px 32px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                color: '#1A1A1A',
                fontSize: '36px',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              Shop by Category
            </h2>
            <p style={{ color: '#6B6B6B', fontSize: '16px' }}>
              Explore our curated collections
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {categories.map((category, index) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                style={{
                  backgroundColor: '#F5F3F0',
                  borderRadius: '16px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  color: '#1A1A1A',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#E07A5F',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '20px',
                  }}
                >
                  {products.filter((p) => p.category === category).length} items
                </div>
                <h3
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '28px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    marginTop: '24px',
                  }}
                >
                  {category}
                </h3>
                <p style={{ color: '#6B6B6B', fontSize: '14px' }}>
                  {index === 0 && 'Tech & gadgets'}
                  {index === 1 && 'Fashion & apparel'}
                  {index === 2 && 'Living spaces'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
