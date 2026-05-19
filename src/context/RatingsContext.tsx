import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductRatings } from '../types';

interface RatingsMap {
  [productId: string]: ProductRatings;
}

interface RatingsContextType {
  getRating: (productId: string) => ProductRatings;
  rateProduct: (productId: string, rating: number) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

const DEFAULT_RATING: ProductRatings = { total: 0, count: 0, userRating: null };

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

  const getRating = useCallback(
    (productId: string): ProductRatings => {
      return ratings[productId] ?? DEFAULT_RATING;
    },
    [ratings]
  );

  const rateProduct = useCallback((productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    setRatings((current) => {
      const existing = current[productId] ?? { total: 0, count: 0, userRating: null };
      const previousRating = existing.userRating;
      const newTotal = previousRating !== null
        ? existing.total - previousRating + clamped
        : existing.total + clamped;
      const newCount = previousRating !== null ? existing.count : existing.count + 1;
      return {
        ...current,
        [productId]: { total: newTotal, count: newCount, userRating: clamped },
      };
    });
  }, []);

  return (
    <RatingsContext.Provider value={{ getRating, rateProduct }}>
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
