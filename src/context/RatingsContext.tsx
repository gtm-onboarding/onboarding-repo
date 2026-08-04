import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type RatingsMap = Record<string, number[]>;

interface RatingsContextType {
  ratings: RatingsMap;
  rateProduct: (productId: string, stars: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<RatingsMap>({});

  useEffect(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        setRatings(JSON.parse(stored));
      } catch {
        localStorage.removeItem(RATINGS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const rateProduct = (productId: string, stars: number) => {
    const clampedStars = Math.min(5, Math.max(1, Math.round(stars)));
    setRatings((current) => ({
      ...current,
      [productId]: [...(current[productId] || []), clampedStars],
    }));
  };

  const getRatingCount = (productId: string) => (ratings[productId] || []).length;

  const getAverageRating = (productId: string) => {
    const productRatings = ratings[productId] || [];
    if (productRatings.length === 0) {
      return 0;
    }
    const sum = productRatings.reduce((total, stars) => total + stars, 0);
    return sum / productRatings.length;
  };

  return (
    <RatingsContext.Provider value={{ ratings, rateProduct, getAverageRating, getRatingCount }}>
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
}
