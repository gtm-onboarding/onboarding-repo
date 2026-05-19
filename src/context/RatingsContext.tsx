import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { products } from '../data/products';

interface ProductRatings {
  ratings: number[];
  userRating: number | null;
}

interface RatingsMap {
  [productId: string]: ProductRatings;
}

interface RatingsContextType {
  rateProduct: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

function generateSeedRatings(): RatingsMap {
  const seededRng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };

  const ratingsMap: RatingsMap = {};

  products.forEach((product, index) => {
    const rng = seededRng(index * 31 + 7);
    const count = Math.floor(rng() * 15) + 5;
    const ratings: number[] = [];
    for (let i = 0; i < count; i++) {
      const value = Math.floor(rng() * 3) + 3;
      ratings.push(value);
    }
    ratingsMap[product.id] = { ratings, userRating: null };
  });

  return ratingsMap;
}

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratingsMap, setRatingsMap] = useState<RatingsMap>(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem(RATINGS_STORAGE_KEY);
      }
    }
    return generateSeedRatings();
  });

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratingsMap));
  }, [ratingsMap]);

  const rateProduct = useCallback((productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    setRatingsMap((prev) => {
      const existing = prev[productId] || { ratings: [], userRating: null };
      const baseRatings = existing.userRating !== null
        ? existing.ratings.slice(0, -1)
        : existing.ratings;
      return {
        ...prev,
        [productId]: {
          ratings: [...baseRatings, clamped],
          userRating: clamped,
        },
      };
    });
  }, []);

  const getAverageRating = useCallback(
    (productId: string): number => {
      const entry = ratingsMap[productId];
      if (!entry || entry.ratings.length === 0) return 0;
      const sum = entry.ratings.reduce((a, b) => a + b, 0);
      return sum / entry.ratings.length;
    },
    [ratingsMap]
  );

  const getUserRating = useCallback(
    (productId: string): number | null => {
      return ratingsMap[productId]?.userRating ?? null;
    },
    [ratingsMap]
  );

  const getRatingCount = useCallback(
    (productId: string): number => {
      return ratingsMap[productId]?.ratings.length ?? 0;
    },
    [ratingsMap]
  );

  return (
    <RatingsContext.Provider
      value={{ rateProduct, getAverageRating, getUserRating, getRatingCount }}
    >
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
