import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const { activeTheme } = useTheme();
  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  return (
    <div style={{ backgroundColor: activeTheme.colors.background, minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: activeTheme.fonts.display,
            color: activeTheme.colors.text,
            marginBottom: '40px',
            fontSize: '36px',
            fontWeight: '600',
          }}
        >
          Wishlist
        </h1>
        {wishlistProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: activeTheme.colors.surface,
              padding: '48px',
              borderRadius: activeTheme.radii.lg,
              textAlign: 'center',
              boxShadow: activeTheme.shadows.md,
            }}
          >
            <p style={{ color: activeTheme.colors.textSecondary, fontSize: '18px', marginBottom: '24px' }}>
              Your wishlist is empty.
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: activeTheme.colors.primary,
                color: 'white',
                padding: '14px 32px',
                borderRadius: activeTheme.radii.sm,
                display: 'inline-block',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
