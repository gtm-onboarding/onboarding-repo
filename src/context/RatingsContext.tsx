import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductRatings } from '../types';
import { seedRatings } from '../data/ratings';

interface RatingsContextType {
  ratings: ProductRatings;
  userRatings: Record<string, number>;
  rateProduct: (productId: string, stars: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<ProductRatings>(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fall through to seed
      }
    }
    return { ...seedRatings };
  });

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem(USER_RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fall through to empty
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(userRatings));
  }, [userRatings]);

  const rateProduct = (productId: string, stars: number) => {
    const clampedStars = Math.min(5, Math.max(1, Math.round(stars)));
    const previousRating = userRatings[productId];

    setRatings((current) => {
      const existing = current[productId] || { total: 0, count: 0 };
      if (previousRating !== undefined) {
        return {
          ...current,
          [productId]: {
            total: existing.total - previousRating + clampedStars,
            count: existing.count,
          },
        };
      }
      return {
        ...current,
        [productId]: {
          total: existing.total + clampedStars,
          count: existing.count + 1,
        },
      };
    });

    setUserRatings((current) => ({
      ...current,
      [productId]: clampedStars,
    }));
  };

  const getAverageRating = (productId: string): number => {
    const rating = ratings[productId];
    if (!rating || rating.count === 0) return 0;
    return rating.total / rating.count;
  };

  const getRatingCount = (productId: string): number => {
    return ratings[productId]?.count || 0;
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        userRatings,
        rateProduct,
        getAverageRating,
        getRatingCount,
      }}
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
